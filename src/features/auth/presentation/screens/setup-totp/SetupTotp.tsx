import { SecurityStackParamList } from '@/app/navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Toast from 'react-native-toast-message';
import { useAuth } from '../../../hooks/useAuth';

type Props = NativeStackScreenProps<SecurityStackParamList, 'SetupTotp'>;

const SetupTotpScreen = ({ navigation }: Props) => {
	const { setupTotp, verifyTotpSetup } = useAuth();

	const [qr, setQr] = useState('');
	const [code, setCode] = useState('');

	useEffect(() => {
		const load = async () => {
			const result: any = await setupTotp();

			setQr(result.otpUri);
		};

		load();
	}, []);

	const confirm = async () => {
		try {
			await verifyTotpSetup(code);
			Toast.show({
				type: 'success',
				text1: '2FA activado',
				text2: 'La autenticación en dos pasos se activó correctamente',
			});
			setTimeout(() => {
				navigation.reset({
					index: 0,
					routes: [
						{
							name: 'App',
							state: {
								routes: [{ name: 'Tasks' }],
							},
						},
					],
				});
			}, 500);
		} catch (err) {
			Toast.show({
				type: 'error',
				text1: 'Código inválido',
				text2: 'Intenta nuevamente',
			});
		}
	};

	return (
		<View style={{ padding: 20 }}>
			<Text>Escanea este código</Text>

			{qr ? <QRCode value={qr} size={200} /> : null}

			<TextInput
				value={code}
				onChangeText={setCode}
				placeholder='Código de 6 dígitos'
				keyboardType='numeric'
				style={{ borderWidth: 1, marginVertical: 20 }}
			/>

			<Button title='Confirmar' onPress={confirm} />
		</View>
	);
};

export default SetupTotpScreen;
