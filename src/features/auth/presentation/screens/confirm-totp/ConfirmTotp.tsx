import { useTheme } from '@react-navigation/native';
import React, { useRef, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { useAuth } from '../../../hooks/useAuth';

const ConfirmTotpScreen = () => {
	const [code, setCode] = useState('');
	const inputRef = useRef<TextInput>(null);

	const { confirmTotp, loading, error } = useAuth();
	const { colors } = useTheme();
	console.log('confirm top');
	const handleConfirm = async () => {
		try {
			const result = await confirmTotp(code);
			Toast.show({
				type: 'success',
				text1: 'Código validado con éxito',
			});
		} catch (e) {
			Toast.show({
				type: 'error',
				text1: 'Error al validad código',
				text2: 'Vuelve a intentar',
			});
		}
	};

	const renderBoxes = () => {
		const digits = code.split('');

		return (
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'space-between',
					marginBottom: 30,
				}}
			>
				{[0, 1, 2, 3, 4, 5].map((i) => (
					<TouchableOpacity
						key={i}
						onPress={() => inputRef.current?.focus()}
						style={{
							width: 48,
							height: 56,
							borderRadius: 10,
							borderWidth: 1,
							borderColor: colors.border,
							justifyContent: 'center',
							alignItems: 'center',
							backgroundColor: colors.card,
						}}
					>
						<Text
							style={{
								fontSize: 22,
								fontWeight: '600',
								color: colors.text,
							}}
						>
							{digits[i] || ''}
						</Text>
					</TouchableOpacity>
				))}
			</View>
		);
	};

	return (
		<SafeAreaView
			style={{
				flex: 1,
				backgroundColor: colors.background,
				paddingHorizontal: 24,
				justifyContent: 'center',
			}}
		>
			<Text
				style={{
					fontSize: 24,
					fontWeight: '700',
					color: colors.text,
					marginBottom: 10,
				}}
			>
				Verificación
			</Text>

			<Text
				style={{
					color: colors.text,
					opacity: 0.6,
					marginBottom: 30,
				}}
			>
				Ingresa el código de tu aplicación autenticadora
			</Text>

			{renderBoxes()}

			<TextInput
				ref={inputRef}
				value={code}
				onChangeText={(text) => {
					const sanitized = text.replace(/[^0-9]/g, '');
					if (sanitized.length <= 6) setCode(sanitized);
				}}
				keyboardType='number-pad'
				maxLength={6}
				style={{
					position: 'absolute',
					opacity: 0,
				}}
			/>

			{error && (
				<Text
					style={{
						color: '#ff4d4f',
						marginBottom: 20,
					}}
				>
					{error}
				</Text>
			)}

			<TouchableOpacity
				onPress={handleConfirm}
				disabled={code.length !== 6 || loading}
				style={{
					backgroundColor: code.length === 6 ? colors.primary : colors.border,
					paddingVertical: 14,
					borderRadius: 12,
					alignItems: 'center',
				}}
			>
				<Text
					style={{
						color: '#fff',
						fontSize: 16,
						fontWeight: '600',
					}}
				>
					{loading ? 'Verificando...' : 'Confirmar'}
				</Text>
			</TouchableOpacity>
		</SafeAreaView>
	);
};

export default ConfirmTotpScreen;
