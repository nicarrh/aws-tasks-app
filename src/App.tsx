import { RootNavigator } from '@navigation';
import { NavigationContainer } from '@react-navigation/native';
import { NavigationTheme } from '@shared';
import React from 'react';
import { AuthProvider } from './features/auth/hooks/useAuth';

export default function App() {
	return (
		<NavigationContainer theme={NavigationTheme}>
			<AuthProvider>
				<RootNavigator />
			</AuthProvider>
		</NavigationContainer>
	);
}
