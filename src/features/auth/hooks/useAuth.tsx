import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';
import { createContext, useContext, useEffect, useRef, useState } from 'react';

import { CognitoRefreshToken, CognitoUser } from 'amazon-cognito-identity-js';
import { AppState, AppStateStatus } from 'react-native';
import { confirmUser, loginUser, logoutUser, registerUser } from '../infraestructure/cognito/auth.repository';
import { userPool } from '../infraestructure/cognito/cognito.config';

// dos minutos para expire token
const BUFFER = 120;

type AuthContextType = {
	isUserLogged: boolean;
	loading: boolean;
	logout: () => Promise<void>;
	login: (email: string, password: string) => void;
	register: (email: string, password: string) => void;
	confirmCode: (email: string, password: string) => void;
	checkAndRefreshToken: () => Promise<string | null>;
	error: string | null;
	loadingSplash: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isUserLogged, setIsUserLogged] = useState(false);
	const appState = useRef<AppStateStatus>(AppState.currentState);
	const [loadingSplash, setLoadingSplash] = useState(true);

	const register = async (email: string, password: string) => {
		try {
			setLoading(true);
			setError(null);

			await registerUser(email, password);
			return { success: true };
		} catch (e) {
			setError(e.message ?? e.name ?? e);
			return { success: false };
		} finally {
			setLoading(false);
		}
	};

	const confirmCode = async (email: string, code: string) => {
		try {
			setLoading(true);
			setError(null);

			await confirmUser(email, code);

			return { success: true };
		} catch (e) {
			setError(e.message ?? e.name ?? e);
			return { success: false };
		} finally {
			setLoading(false);
		}
	};

	const login = async (email: string, password: string) => {
		try {
			setLoading(true);
			setError(null);

			const tokens = await loginUser(email, password);

			await SecureStore.setItemAsync('accessToken', tokens.accessToken);
			await SecureStore.setItemAsync('refreshToken', tokens.refreshToken);
			await SecureStore.setItemAsync('idToken', tokens.idToken);
			setIsUserLogged(true);
			return { success: true };
		} catch (e) {
			console.log('e', e);
			setError(e.message ?? e.name ?? e);
			return { success: false };
		} finally {
			setLoading(false);
		}
	};

	const logout = async () => {
		await logoutUser();
		setLoading(true);
		setIsUserLogged(false);
		await SecureStore.deleteItemAsync('accessToken');
		await SecureStore.deleteItemAsync('refreshToken');
		await SecureStore.deleteItemAsync('idToken');
		setLoading(false);
	};

	useEffect(() => {
		checkAndRefreshToken();
		const subscription = AppState.addEventListener('change', (nextAppState) => {
			if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
				checkAndRefreshToken();
			}
			appState.current = nextAppState;
		});

		return () => {
			subscription.remove();
		};
	}, []);

	const checkAndRefreshToken = async (): Promise<string | null> => {
		setIsUserLogged(false);
		setLoadingSplash(true);
		const accessToken = await SecureStore.getItemAsync('accessToken');
		const _refreshToken = await SecureStore.getItemAsync('refreshToken');
		const idToken = await SecureStore.getItemAsync('idToken');

		if (!accessToken || !_refreshToken || !idToken) {
			console.log('[checkAndRefreshToken]: No hay tokens guardados');
			await logout();
			setLoadingSplash(false);
			return null;
		}

		const now = Math.floor(Date.now() / 1000);
		const decodedAccess: { exp: number } = jwtDecode(accessToken);

		if (decodedAccess.exp - now > BUFFER) {
			setTimeout(() => {
				console.log('[checkAndRefreshToken]: Access token aún válido');
				setIsUserLogged(true);
				setLoadingSplash(false);
			}, 1000);
			return accessToken;
		}
		const decodedId: { sub: string } = jwtDecode(idToken);
		const cognitoUser = new CognitoUser({ Username: decodedId.sub, Pool: userPool });
		const refreshToken = new CognitoRefreshToken({ RefreshToken: _refreshToken });

		console.log('Access token expiró, intentando refresh...');

		return new Promise((resolve) => {
			cognitoUser.refreshSession(refreshToken, async (err, session) => {
				if (err) {
					console.error('[useAuth]: Error refrescando token:', err);
					logout();
					return null;
				}

				// Guardamos nuevos tokens en SecureStore
				await SecureStore.setItemAsync('accessToken', session.getAccessToken().getJwtToken());
				await SecureStore.setItemAsync('idToken', session.getIdToken().getJwtToken());
				await SecureStore.setItemAsync('refreshToken', session.getRefreshToken().getToken());
				console.log('[checkAndRefreshToken]: Token renovado automáticamente');
				setIsUserLogged(true);
				setTimeout(() => setLoadingSplash(false), 500);
				resolve(session.getAccessToken().getJwtToken());
			});
		});
	};

	return (
		<AuthContext.Provider
			value={{
				register,
				confirmCode,
				login,
				logout,
				loading,
				error,
				checkAndRefreshToken,
				isUserLogged,
				loadingSplash,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) throw new Error('useAuth must be used within an AuthProvider');
	return context;
};
