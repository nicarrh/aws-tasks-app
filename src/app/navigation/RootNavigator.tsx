import { useAuth } from '@/features/auth/hooks/useAuth';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppSplash from '../presentation/screens/Splash';
import AppNavigator from './AppNavigator';
import AuthNavigator from './AuthNavigator';
import SecurityNavigator from './SecurityNavigator';
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
				<Stack.Screen name='App' component={AppNavigator} />
			) : (
				<Stack.Screen name='Auth' component={AuthNavigator} />
			)}

			{/* seguridad */}
			<Stack.Screen name='Security' component={SecurityNavigator} />
		</Stack.Navigator>
	);
}
