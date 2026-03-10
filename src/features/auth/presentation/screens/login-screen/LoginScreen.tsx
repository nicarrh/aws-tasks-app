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
	const [isLoadingLogin, setIsLoadingLogin] = useState(false);

	const doLoginHandler = async () => {
		try {
			setIsLoadingLogin(true);
			const result = await login(email, password);

			if (result?.mfaRequired) {
				navigation.navigate('ConfirmTotp');
				return;
			}

			if (result?.success) {
				// Login exitoso, RootNavigator lo manejará
			}
		} catch (e) {
			console.error(e);
		} finally {
			setIsLoadingLogin(false);
		}
	};

	const goToRegisterScreen = () => {
		navigation.navigate('Register');
	};

	const goToForgotPassword = () => {
		navigation.navigate('ForgotPassword');
	};

	useEffect(() => {
		if (error) {
			Toast.show({
				type: 'error',
				text1: 'Se ha producido un error',
				text2: error,
			});
		}
	}, [error]);

	return (
		<View style={styles.container}>
			<View style={styles.content}>
				<View style={styles.spacing}>
					<EmailInput value={email} onChangeText={setEmail} name='email' />
				</View>
				<View style={styles.spacing}>
					<PasswordInput value={password} onChangeText={setPassword} name='password' />
				</View>

				<TouchableOpacity onPress={goToForgotPassword} style={{ alignSelf: 'flex-end', marginBottom: 20 }}>
					<Text style={{ color: colors.primary, fontWeight: '500' }}>¿Olvidaste tu contraseña?</Text>
				</TouchableOpacity>

				<View style={styles.buttons}>
					<TouchableOpacity
						style={styles.primaryBtn}
						onPress={doLoginHandler}
						disabled={!email?.length || !password?.length || isLoadingLogin}
					>
						{loading || isLoadingLogin ? (
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
