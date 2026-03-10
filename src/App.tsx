import { USER_POOL_CLIENT_ID, USER_POOL_ID } from '@env';
import { RootNavigator } from '@navigation';
import { NavigationContainer } from '@react-navigation/native';
import { NavigationTheme } from '@shared';
import { Amplify } from 'aws-amplify';
import React from 'react';
import 'react-native-get-random-values'; // necesario para crypto
import Toast from 'react-native-toast-message';
import { AuthProvider } from './features/auth/hooks/useAuth';
import ModalTotp from './features/auth/presentation/components/ModalTotp';

Amplify.configure({
	Auth: {
		Cognito: {
			userPoolId: USER_POOL_ID,
			userPoolClientId: USER_POOL_CLIENT_ID,
			signUpVerificationMethod: 'code',
		},
	},
});

export default function App() {
	return (
		<NavigationContainer theme={NavigationTheme}>
			<AuthProvider>
				<RootNavigator />
				<ModalTotp />
			</AuthProvider>
			<Toast position='bottom' />
		</NavigationContainer>
	);
}
