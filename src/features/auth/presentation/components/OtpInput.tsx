import { useTheme } from '@react-navigation/native';
import React, { useRef } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

type Props = {
	value: string;
	onChange: (value: string) => void;
};

export default function OtpInput({ value, onChange }: Props) {
	const { colors } = useTheme();
	const inputRef = useRef<TextInput>(null);

	const digits = value.split('');

	return (
		<>
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

			<TextInput
				ref={inputRef}
				value={value}
				keyboardType='number-pad'
				maxLength={6}
				onChangeText={(text) => {
					const sanitized = text.replace(/[^0-9]/g, '');
					if (sanitized.length <= 6) {
						onChange(sanitized);
					}
				}}
				style={{
					position: 'absolute',
					opacity: 0,
				}}
			/>
		</>
	);
}
