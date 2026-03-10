import { RootNavigator } from '@navigation';
import { NavigationContainer } from '@react-navigation/native';
import { NavigationTheme } from '@shared';
import React from 'react';
import Toast from 'react-native-toast-message';
import { AuthProvider } from './features/auth/hooks/useAuth';
import ModalTotp from './features/auth/presentation/components/ModalTotp';

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
