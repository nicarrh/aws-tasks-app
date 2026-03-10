import { NavigationTheme } from '@/shared';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TasksScreen } from '@tasks';
import { ProfileScreen } from '../../features/profile';
import { AppStackParamList } from './types';

const Tab = createBottomTabNavigator<AppStackParamList>();

export default function AppNavigator() {
	const { colors } = NavigationTheme;
	return (
		<Tab.Navigator>
			<Tab.Screen
				name='Tasks'
				component={TasksScreen}
				options={{
					header: () => null,
					tabBarIcon: ({ focused }) => (
						<Ionicons name='list' size={24} color={focused ? colors.primary : colors.textSecondary} />
					),
					title: 'Tareas',
				}}
			/>
			<Tab.Screen
				name='Profile'
				component={ProfileScreen}
				options={{
					header: () => null,
					tabBarIcon: ({ focused }) => (
						<Ionicons name='person' size={24} color={focused ? colors.primary : colors.textSecondary} />
					),
					title: 'Perfil',
				}}
			/>
		</Tab.Navigator>
	);
}
