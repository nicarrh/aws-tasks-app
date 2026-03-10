import { AuthenticationDetails, CognitoUser, CognitoUserAttribute } from 'amazon-cognito-identity-js';
import { userPool } from './cognito.config';

type CognitoTokens = {
	accessToken: string;
	idToken: string;
	refreshToken: string;
};

export const registerUser = (email: string, password: string): Promise<any> => {
	const attributes = [
		new CognitoUserAttribute({
			Name: 'email',
			Value: email,
		}),
	];

	return new Promise((resolve, reject) => {
		userPool.signUp(email, password, attributes, [], (err: any, result) => {
			if (err) {
				console.error('[signup]: ', err?.message ?? err?.name ?? err);
				reject(err);
			} else {
				console.log('[signup]', result);
				resolve(result);
			}
		});
	});
};

export const confirmUser = (email: string, code: string) => {
	const user = new CognitoUser({
		Username: email,
		Pool: userPool,
	});

	return new Promise((resolve, reject) => {
		user.confirmRegistration(code, true, (err, result) => {
			if (err) reject(err);
			else resolve(result);
		});
	});
};

export const loginUser = (email: string, password: string) => {
	return new Promise<CognitoTokens>((resolve, reject) => {
		const authenticationDetails = new AuthenticationDetails({
			Username: email,
			Password: password,
		});

		const cognitoUser = new CognitoUser({
			Username: email,
			Pool: userPool,
		});

		cognitoUser.authenticateUser(authenticationDetails, {
			onSuccess: (session) => {
				resolve({
					accessToken: session.getAccessToken().getJwtToken(),
					idToken: session.getIdToken().getJwtToken(),
					refreshToken: session.getRefreshToken().getToken(),
				});
			},

			onFailure: (err) => {
				reject(err);
			},

			newPasswordRequired: () => {
				reject(new Error('New password required'));
			},
		});
	});
};

export const logoutUser = () => {
	const cognitoUser = userPool.getCurrentUser();

	if (cognitoUser) {
		cognitoUser.signOut();
	}
};
