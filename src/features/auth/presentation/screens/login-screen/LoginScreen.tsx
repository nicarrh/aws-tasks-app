import { useAuth } from '@/features/auth/hooks/useAuth';
import { NavigationTheme } from '@/shared';
import { NavigationTypes } from '@navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import EmailInput from '../../components/EmailInput';
import PasswordInput from '../../components/PasswordInput';
import { FormProvider } from '../../forms/FormProvider';
import createStyles from './Login.styles';

type LoginProps = NativeStackScreenProps<NavigationTypes.AuthStackParamList, 'Login'>;

function LoginForm({ navigation }: LoginProps) {
	const { login, loading, error } = useAuth();
	const { colors } = NavigationTheme;
	const styles = createStyles(colors);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const doLoginHandler = async () => {
		try {
			if (email.length && password.length) {
				const res = await login(email, password);
				console.log('response', res);
			}
		} catch (e) {
			console.error(e);
		}
	};
	const changeEmailHandler = (t: string) => {
		setEmail(t);
	};
	const changePasswordHandler = (t: string) => {
		setPassword(t);
	};
	const goToRegisterScreen = () => {
		navigation.navigate('Register');
	};

	useEffect(() => {
		if (error) {
			Toast.show({
				type: 'error',
				text1: 'Se ha producido un error',
				text2: 'vuelva a intentar',
			});
		}
	}, [error]);

	return (
		<View style={styles.container}>
			<View style={styles.content}>
				<View style={styles.spacing}>
					<EmailInput value={email} onChangeText={changeEmailHandler} name='email' />
				</View>
				<View style={styles.spacing}>
					<PasswordInput value={password} onChangeText={changePasswordHandler} name='password' />
				</View>

				<View style={styles.buttons}>
					<TouchableOpacity style={styles.primaryBtn} onPress={doLoginHandler}>
						{loading ? (
							<ActivityIndicator size={24} color={colors.surface} />
						) : (
							<Text style={styles.btnText}>Continuar</Text>
						)}
					</TouchableOpacity>
					<TouchableOpacity style={styles.btnRegister} onPress={goToRegisterScreen}>
						<Text style={styles.btnRegisterText}>Registrarme</Text>
					</TouchableOpacity>
				</View>
			</View>
			<Toast position='bottom' />
		</View>
	);
}

export default function LoginScreen({ navigation, route }: LoginProps) {
	return (
		<FormProvider>
			<LoginForm navigation={navigation} route={route} />
		</FormProvider>
	);
}
