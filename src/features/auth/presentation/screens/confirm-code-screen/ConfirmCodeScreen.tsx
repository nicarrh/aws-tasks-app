import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { NavigationTypes } from '@navigation';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../../hooks/useAuth';
import createStyles from './ConfirmCodeScreen.styles';

type Props = NativeStackScreenProps<NavigationTypes.AuthStackParamList, 'ConfirmCode'>;

export const ConfirmCodeScreen = ({ route, navigation }: Props) => {
	const { email } = route.params;
	const { confirmCode } = useAuth();

	const [code, setCode] = useState('');
	const styles = createStyles();

	const handleConfirm = async () => {
		try {
			await confirmCode(email, code);

			Alert.alert('Cuenta verificada', 'Ahora puedes iniciar sesión');

			navigation.navigate('Login');
		} catch (error) {
			Alert.alert('Error', error.message || 'No se pudo confirmar el código');
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={{ justifyContent: 'center' }}>
				<TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 10 }}>
					<Ionicons name='arrow-back' size={24} color='black' />
				</TouchableOpacity>
			</View>
			<View style={styles.content}>
				<Text style={styles.title}>Confirmar cuenta</Text>
				<View style={{ gap: 8 }}>
					<Text style={styles.subtitle}>Ingresa el código enviado a:</Text>

					<Text style={styles.email}>{email}</Text>

					<TextInput
						style={styles.input}
						placeholder='Código de verificación'
						keyboardType='number-pad'
						value={code}
						onChangeText={setCode}
					/>

					<TouchableOpacity style={styles.button} onPress={handleConfirm}>
						<Text style={styles.buttonText}>Confirmar</Text>
					</TouchableOpacity>

					<TouchableOpacity onPress={() => navigation.navigate('Login')}>
						<Text style={styles.link}>Volver al login</Text>
					</TouchableOpacity>
				</View>
			</View>
		</SafeAreaView>
	);
};
