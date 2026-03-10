import { useAuth } from '@auth';
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

export default function ForgotPasswordScreen({ navigation }: any) {
	const { forgotPassword } = useAuth();

	const [email, setEmail] = useState('');

	const handleRecover = async () => {
		const result = await forgotPassword(email);

		if (result.success) {
			navigation.navigate('ResetPassword', { email });
		} else {
			Toast.show({
				type: 'error',
				text1: 'Error',
				text2: result.message,
			});
		}
	};

	return (
		<SafeAreaView style={{ padding: 24 }}>
			<Text style={{ fontSize: 24, fontWeight: '700' }}>Recuperar contraseña</Text>

			<TextInput
				placeholder='Email'
				value={email}
				onChangeText={setEmail}
				autoCapitalize='none'
				style={{
					borderWidth: 1,
					marginVertical: 20,
					padding: 12,
					borderRadius: 8,
					borderColor: '#ccc',
				}}
			/>

			<TouchableOpacity
				onPress={handleRecover}
				style={{
					backgroundColor: '#4A67FF',
					padding: 14,
					borderRadius: 10,
					alignItems: 'center',
				}}
			>
				<Text style={{ color: '#fff', fontWeight: '600' }}>Enviar código</Text>
			</TouchableOpacity>
		</SafeAreaView>
	);
}
