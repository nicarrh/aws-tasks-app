import { confirmResetPassword, resetPassword } from '@aws-amplify/auth';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { CognitoRefreshToken, CognitoUser } from 'amazon-cognito-identity-js';
import { deleteItemAsync, getItemAsync, setItemAsync } from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { confirmUser, loginUser, logoutUser, registerUser } from '../infraestructure/cognito/auth.repository';

import { RootStackParamList } from '@/app/navigation/types';
import { userPool } from '../infraestructure/cognito/cognito.config';

const BUFFER = 120;
const FIVE_MINUTES = 5 * 60 * 1000;

type AuthContextType = {
	isUserLogged: boolean;
	loading: boolean;
	error: string | null;
	loadingSplash: boolean;

	mfaRequired: boolean;
	showTotpPrompt: boolean;
	totpEnabled: boolean;

	login: (email: string, password: string) => Promise<{ success: boolean; mfaRequired?: boolean }>;
	logout: () => Promise<void>;
	register: (email: string, password: string) => Promise<any>;
	confirmCode: (email: string, code: string) => Promise<any>;

	confirmTotp: (code: string) => Promise<any>;
	setupTotp: () => Promise<any>;
	verifyTotpSetup: (code: string) => Promise<any>;

	acceptTotp: () => Promise<void>;
	declineTotp: () => Promise<void>;

	checkAndRefreshToken: () => Promise<string | null>;

	forgotPassword: (email: string) => Promise<any>;
	confirmForgotPassword: (email: string, code: string, newPassword: string) => Promise<any>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const navigation = useNavigation<NavigationProp<RootStackParamList>>();

	const [loading, setLoading] = useState(false);
	const [loadingSplash, setLoadingSplash] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const [isUserLogged, setIsUserLogged] = useState(false);

	const [mfaRequired, setMfaRequired] = useState(false);
	const [showTotpPrompt, setShowTotpPrompt] = useState(false);
	const [totpEnabled, setTotpEnabled] = useState(false);

	const cognitoUserRef = useRef<CognitoUser | null>(null);
	const appState = useRef<AppStateStatus>(AppState.currentState);

	const checkTotpPrompt = async () => {
		const lastShown = await getItemAsync('totpPromptLastShown');

		if (lastShown) {
			const diff = Date.now() - Number(lastShown);
			if (diff < FIVE_MINUTES) return;
		}

		const user = userPool.getCurrentUser();
		if (!user) return;

		user.getSession(() => {
			user.getUserData((_, data) => {
				const hasTotp = data?.UserMFASettingList?.includes('SOFTWARE_TOKEN_MFA');

				setTotpEnabled(!!hasTotp);

				if (!hasTotp) {
					setShowTotpPrompt(true);
				}
			});
		});
	};

	const acceptTotp = async () => {
		await setItemAsync('totpPromptLastShown', Date.now().toString());

		setShowTotpPrompt(false);

		navigation.navigate('Security', {
			screen: 'SetupTotp',
		});
	};

	const declineTotp = async () => {
		await setItemAsync('totpPromptLastShown', Date.now().toString());

		setShowTotpPrompt(false);
	};

	const login = async (email: string, password: string): Promise<{ success: boolean; mfaRequired?: boolean }> => {
		try {
			setLoading(true);
			setError(null);

			const result = await loginUser(email, password);

			if (result.type === 'MFA_REQUIRED') {
				cognitoUserRef.current = result.cognitoUser;
				console.log('[AUTH] cognitoUser guardado:', cognitoUserRef.current.getUsername());
				setMfaRequired(true);

				return { success: false, mfaRequired: true };
			}

			const tokens = result.tokens;

			await setItemAsync('accessToken', tokens.accessToken);
			await setItemAsync('refreshToken', tokens.refreshToken);
			await setItemAsync('idToken', tokens.idToken);
			await setItemAsync('username', email);

			setIsUserLogged(true);

			await checkTotpPrompt();

			return { success: true };
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (e) {
			if (e instanceof Error) {
				setError(e.message);
			} else {
				setError(String(e));
			}

			return { success: false };
		} finally {
			setLoading(false);
		}
	};

	const confirmTotp = async (code: string) => {
		if (!cognitoUserRef.current) return;

		console.log('[MFA] cognitoUserRef:', cognitoUserRef.current);

		return new Promise((resolve) => {
			cognitoUserRef.current!.sendMFACode(
				code,
				{
					onSuccess: async (session) => {
						await setItemAsync('accessToken', session.getAccessToken().getJwtToken());

						await setItemAsync('idToken', session.getIdToken().getJwtToken());

						await setItemAsync('refreshToken', session.getRefreshToken().getToken());

						setIsUserLogged(true);
						setMfaRequired(false);

						resolve({ success: true });
					},

					onFailure: (err) => {
						setError(err.message);

						resolve({ success: false });
					},
				},
				'SOFTWARE_TOKEN_MFA',
			);
		});
	};

	/* -------------------------------------------------------------------------- */
	/*                               SETUP MFA                                    */
	/* -------------------------------------------------------------------------- */

	const setupTotp = async () => {
		const user = userPool.getCurrentUser();
		if (!user) throw new Error('Usuario no autenticado');

		return new Promise((resolve, reject) => {
			user.getSession((err: any) => {
				if (err) {
					reject(err);
					return;
				}

				user.associateSoftwareToken({
					associateSecretCode: (secretCode) => {
						const username = user.getUsername();

						const otpUri = `otpauth://totp/HaulmerApp:${username}?secret=${secretCode}&issuer=HaulmerApp`;

						resolve({
							secretCode,
							otpUri,
						});
					},

					onFailure: reject,
				});
			});
		});
	};

	const verifyTotpSetup = async (code: string) => {
		const user = userPool.getCurrentUser();

		if (!user) throw new Error('User not found');

		return new Promise((resolve, reject) => {
			user.getSession((err: any, session: any) => {
				if (err || !session?.isValid()) {
					reject('Session inválida');
					return;
				}

				user.verifySoftwareToken(code, 'HaulmerApp', {
					onSuccess: () => {
						user.setUserMfaPreference(
							null,
							{
								Enabled: true,
								PreferredMfa: true,
							},
							(err) => {
								if (err) {
									reject(err);
									return;
								}

								setTotpEnabled(true);
								console.log('success');
								resolve({ success: true });
							},
						);
					},

					onFailure: (err) => {
						console.log('on Failure', err);
						reject(err);
					},
				});
			});
		});
	};

	const register = async (email: string, password: string) => {
		try {
			setLoading(true);

			await registerUser(email, password);

			return { success: true };
		} catch (e) {
			let error = {} as any;
			if (e instanceof Error) {
				error = e.message;
			} else {
				error = String(e);
			}
			setError(error);
			return {
				success: false,
				message: error,
			};
		} finally {
			setLoading(false);
		}
	};

	const confirmCode = async (email: string, code: string) => {
		try {
			setLoading(true);

			await confirmUser(email, code);

			return { success: true };
		} catch (e) {
			if (e instanceof Error) {
				setError(e.message);
			} else {
				setError(String(e));
			}

			return { success: false };
		} finally {
			setLoading(false);
		}
	};

	const logout = async () => {
		await logoutUser();

		await deleteItemAsync('accessToken');
		await deleteItemAsync('refreshToken');
		await deleteItemAsync('idToken');

		setIsUserLogged(false);
	};

	const checkAndRefreshToken = async (): Promise<string | null> => {
		const accessToken = await getItemAsync('accessToken');
		const refreshToken = await getItemAsync('refreshToken');
		const idToken = await getItemAsync('idToken');
		const username = await getItemAsync('username');

		if (!accessToken || !refreshToken || !idToken || !username) {
			setLoadingSplash(false);
			return null;
		}

		const now = Math.floor(Date.now() / 1000);
		const decoded: { exp: number } = jwtDecode(accessToken);

		if (decoded.exp - now > BUFFER) {
			setIsUserLogged(true);
			setLoadingSplash(false);

			return accessToken;
		}

		const cognitoUser = new CognitoUser({
			Username: username!,
			Pool: userPool,
		});

		const refresh = new CognitoRefreshToken({
			RefreshToken: refreshToken,
		});

		return new Promise((resolve) => {
			cognitoUser.refreshSession(refresh, async (_, session) => {
				await setItemAsync('accessToken', session.getAccessToken().getJwtToken());

				await setItemAsync('idToken', session.getIdToken().getJwtToken());

				await setItemAsync('refreshToken', session.getRefreshToken().getToken());

				setIsUserLogged(true);
				setLoadingSplash(false);

				resolve(session.getAccessToken().getJwtToken());
			});
		});
	};

	const forgotPassword = async (email: string) => {
		try {
			await resetPassword({
				username: email,
			});

			return { success: true };
		} catch (e) {
			let error = {} as any;
			if (e instanceof Error) {
				error = e.message;
			} else {
				error = String(e);
			}
			return {
				success: false,
				message: error,
			};
		}
	};

	const confirmForgotPassword = async (email: string, code: string, newPassword: string) => {
		try {
			await confirmResetPassword({
				username: email,
				confirmationCode: code,
				newPassword,
			});

			return { success: true };
		} catch (e) {
			let error = {} as any;
			if (e instanceof Error) {
				error = e.message;
			} else {
				error = String(e);
			}
			return {
				success: false,
				message: error,
			};
		}
	};

	useEffect(() => {
		checkAndRefreshToken();

		const subscription = AppState.addEventListener('change', (nextAppState) => {
			if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
				checkTotpPrompt();
			}

			appState.current = nextAppState;
		});

		return () => subscription.remove();
	}, []);

	return (
		<AuthContext.Provider
			value={{
				login,
				logout,
				register,
				confirmCode,
				confirmTotp,
				setupTotp,
				verifyTotpSetup,
				acceptTotp,
				declineTotp,
				checkAndRefreshToken,

				isUserLogged,
				loading,
				error,
				loadingSplash,
				mfaRequired,
				showTotpPrompt,
				totpEnabled,

				forgotPassword,
				confirmForgotPassword,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);

	if (!context) throw new Error('useAuth must be used within AuthProvider');

	return context;
};
