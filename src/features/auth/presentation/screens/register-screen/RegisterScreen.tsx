import { NavigationTypes } from '@/app/navigation';
import { NavigationTheme } from '@/shared';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { useAuth } from '../../../hooks/useAuth';
import ConfirmPasswordInput from '../../components/ConfirmPasswordInput';
import EmailInput from '../../components/EmailInput';
import PasswordInput from '../../components/PasswordInput';
import { FormProvider, useForm } from '../../forms/FormProvider';
import createStyles from './RegisterScreen.styles';

type RegisterProps = NativeStackScreenProps<NavigationTypes.AuthStackParamList, 'Register'>;

export const RegisterForm = ({ navigation }: RegisterProps) => {
	const { register, loading, error } = useAuth();
	const { colors } = NavigationTheme;
	const styles = createStyles(colors);

	const { fields } = useForm();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirm, setConfirm] = useState('');

	const formValid = Object.values(fields).every((f) => f.valid);
	const getErrorText = () => {
		let result = {
			text1: 'Se ha producido un error',
			text2: 'vuelva a intentar',
		};
		if (error === 'User already exists') {
			result = {
				text1: 'Correo ya registrado',
				text2: 'Intenta iniciar sesión o usa otro correo',
			};
		}
		return result;
	};
	const registerHandler = async () => {
		try {
			const result = await register(email, password);
			console.log('result', result);
			if (result.success) {
				navigation.navigate('ConfirmCode', {
					email: email,
				});
			} else {
				Toast.show({
					type: 'error',
					text1: getErrorText().text1,
					text2: getErrorText().text2,
				});
			}
		} catch (e) {
			console.error('error', e);
			if (e.name === 'UsernameExistsException') {
				console.log('error', e.name);
			}
		}

		console.log('Register', email, password);
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={{ justifyContent: 'center' }}>
				<TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 10 }}>
					<Ionicons name='arrow-back' size={24} color='black' />
				</TouchableOpacity>
			</View>
			<View style={styles.formContent}>
				<Text style={styles.title}>Crea tu cuenta</Text>
				<EmailInput value={email} onChangeText={setEmail} name='email' />
				<PasswordInput value={password} onChangeText={setPassword} name='password' isInRegister />
				<ConfirmPasswordInput value={confirm} onChangeText={setConfirm} password={password} name='confirm' />
				<TouchableOpacity
					style={[styles.button, { backgroundColor: formValid ? colors.primary : '#B0B0B0' }]}
					onPress={registerHandler}
					disabled={!formValid}
				>
					<Text style={styles.buttonText}>Registarme</Text>
				</TouchableOpacity>

				<View style={styles.footer}>
					<Text style={{ color: colors.text }}>
						¿Ya tienes una cuenta?{' '}
						<Text style={styles.linkText} onPress={() => navigation.navigate('Login')}>
							Iniciar Sesión
						</Text>
						<Toast position='bottom' />
					</Text>
				</View>
			</View>
		</SafeAreaView>
	);
};

export default function RegisterScreen({ navigation, route }: RegisterProps) {
	return (
		<FormProvider>
			<RegisterForm navigation={navigation} route={route} />
		</FormProvider>
	);
}
