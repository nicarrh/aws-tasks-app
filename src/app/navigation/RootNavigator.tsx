import { useAuth } from '@/features/auth/hooks/useAuth';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppSplash from '../presentation/screens/Splash';
import AppNavigator from './AppNavigator';
import AuthNavigator from './AuthNavigator';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
	const { isUserLogged, loadingSplash } = useAuth();

	if (loadingSplash) {
		return <AppSplash />;
	}

	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			{isUserLogged ? (
				<Stack.Screen name='App' component={AppNavigator} options={{ header: () => null }} />
			) : (
				<Stack.Screen name='Auth' component={AuthNavigator} options={{ header: () => null }} />
			)}
		</Stack.Navigator>
	);
}
