import { ConfirmCodeScreen, ConfirmTotpScreen, LoginScreen, RegisterScreen } from '@auth';
import { Ionicons } from '@expo/vector-icons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity } from 'react-native';
import { AuthStackParamList } from './types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen name='Login' component={LoginScreen} />
			<Stack.Screen name='Register' component={RegisterScreen} />
			<Stack.Screen
				name='ConfirmCode'
				component={ConfirmCodeScreen}
				options={{
					headerLeft: () => (
						<TouchableOpacity>
							<Ionicons name='arrow-back-circle' size={24} color='black' />
						</TouchableOpacity>
					),
				}}
			/>
			<Stack.Screen name='ConfirmTotp' component={ConfirmTotpScreen} />
		</Stack.Navigator>
	);
}
