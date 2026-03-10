import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SecurityStackParamList } from './types';

import { ConfirmTotpScreen, SetupTotpScreen } from '@auth';

const Stack = createNativeStackNavigator<SecurityStackParamList>();

export default function SecurityNavigator() {
	return (
		<Stack.Navigator screenOptions={{ header: () => null }}>
			<Stack.Screen name='SetupTotp' component={SetupTotpScreen} />

			<Stack.Screen name='ConfirmTotp' component={ConfirmTotpScreen} />
		</Stack.Navigator>
	);
}
