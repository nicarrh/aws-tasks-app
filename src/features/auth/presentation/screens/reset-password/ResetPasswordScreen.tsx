import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { useAuth } from '../../../hooks/useAuth';
import OtpInput from '../../components/OtpInput';

export default function ResetPasswordScreen({ route, navigation }: any) {
	const { email } = route.params;

	const { confirmForgotPassword } = useAuth();

	const [code, setCode] = useState('');
	const [password, setPassword] = useState('');

	const confirm = async () => {
		const result = await confirmForgotPassword(email, code, password);

		if (result.success) {
			Toast.show({
				type: 'success',
				text1: 'Contraseña actualizada',
			});

			setTimeout(() => {
				navigation.navigate('Login');
			}, 1000);
		} else {
			Toast.show({
				type: 'error',
				text1: 'Error',
				text2: result.message,
			});
		}
	};

	return (
		<SafeAreaView style={{ padding: 24, gap: 24 }}>
			<Text style={{ fontSize: 24, fontWeight: '700' }}>Ingresar código</Text>
			<OtpInput value={code} onChange={setCode} />

			<View>
				<TextInput
					placeholder='Nueva contraseña'
					secureTextEntry
					value={password}
					onChangeText={setPassword}
					style={{
						borderWidth: 1,
						padding: 12,
						borderRadius: 8,
						marginBottom: 20,
					}}
				/>

				<TouchableOpacity
					onPress={confirm}
					style={{
						backgroundColor: '#4A67FF',
						padding: 14,
						borderRadius: 10,
						alignItems: 'center',
					}}
				>
					<Text style={{ color: '#fff', fontWeight: '600' }}>Cambiar contraseña</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
}
