// authService.ts
import { CognitoRefreshToken, CognitoUser } from 'amazon-cognito-identity-js';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';
import { userPool } from '../infraestructure/cognito/cognito.config';

const BUFFER = 120;

export async function getValidAccessToken(): Promise<string | null> {
	const accessToken = await SecureStore.getItemAsync('accessToken');
	const refreshTokenStr = await SecureStore.getItemAsync('refreshToken');
	const idToken = await SecureStore.getItemAsync('idToken');

	if (!accessToken || !refreshTokenStr || !idToken) return null;

	const now = Math.floor(Date.now() / 1000);
	const decodedAccess: { exp: number } = jwtDecode(accessToken);

	if (decodedAccess.exp - now > BUFFER) return accessToken;

	const decodedId: { sub: string } = jwtDecode(idToken);
	const cognitoUser = new CognitoUser({ Username: decodedId.sub, Pool: userPool });
	const refreshToken = new CognitoRefreshToken({ RefreshToken: refreshTokenStr });

	return new Promise((resolve) => {
		cognitoUser.refreshSession(refreshToken, async (err, session) => {
			if (err) {
				await SecureStore.deleteItemAsync('accessToken');
				await SecureStore.deleteItemAsync('idToken');
				await SecureStore.deleteItemAsync('refreshToken');
				resolve(null);
				return;
			}

			await SecureStore.setItemAsync('accessToken', session.getAccessToken().getJwtToken());
			await SecureStore.setItemAsync('idToken', session.getIdToken().getJwtToken());
			await SecureStore.setItemAsync('refreshToken', session.getRefreshToken().getToken());

			resolve(session.getAccessToken().getJwtToken());
		});
	});
}
