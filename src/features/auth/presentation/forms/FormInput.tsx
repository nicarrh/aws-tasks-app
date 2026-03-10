import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

type Props = {
	value: string;
	onChangeText: (text: string) => void;
	placeholder?: string;
	error?: string | null;
	secureTextEntry?: boolean;
	onFocus?: () => void;
	onBlur?: () => void;
};

export const FormInput: React.FC<Props> = ({
	value,
	onChangeText,
	placeholder,
	error,
	secureTextEntry,
	onFocus,
	onBlur,
}) => {
	const [showPassword, setShowPassword] = useState(false);

	return (
		<View style={{ marginBottom: 16 }}>
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					borderWidth: 1,
					borderRadius: 10,
					borderColor: error ? '#ff4d4f' : '#ccc',
					paddingHorizontal: 16,
					height: 50,
				}}
			>
				<TextInput
					value={value}
					placeholder={placeholder}
					onChangeText={onChangeText}
					secureTextEntry={secureTextEntry && !showPassword} // toggle
					onFocus={onFocus}
					onBlur={onBlur}
					autoCapitalize='none'
					autoCorrect={false}
					style={{ flex: 1, height: '100%' }}
				/>
				{secureTextEntry && (
					<TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
						<Text style={{ color: '#007AFF', marginLeft: 8 }}>{showPassword ? '🙈' : '👁️'}</Text>
					</TouchableOpacity>
				)}
			</View>
			{error && <Text style={{ color: '#ff4d4f', marginTop: 6 }}>{error}</Text>}
		</View>
	);
};
