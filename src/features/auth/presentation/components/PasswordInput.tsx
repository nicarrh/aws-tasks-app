import { NavigationTheme } from '@/shared';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { getPasswordStrength, validatePassword } from '../../use-cases';
import { FormInput } from '../forms/FormInput';
import { useFormField } from '../forms/hooks/userFormField';
import createStyles from './PasswordInput.styles';

type Props = {
	value: string;
	onChangeText: (text: string) => void;
	name: string;
	isInRegister?: boolean;
};

const PasswordInput: React.FC<Props> = ({ value, onChangeText, name, isInRegister = false }) => {
	const [touched, setTouched] = useState(false);
	const [blurred, setBlurred] = useState(false);
	const [rules, setRules] = useState(validatePassword(value));
	const { colors } = NavigationTheme;
	const styles = createStyles(colors);

	useEffect(() => {
		setRules(validatePassword(value));
	}, [value]);

	const validate = (val: string) => {
		if (!val) {
			return { valid: false, error: blurred ? 'La contraseña es obligatoria' : null };
		}
		if (isInRegister) {
			if (!rules.length) return { valid: false, error: 'Debe tener al menos 8 caracteres' };
			if (!rules.upper) return { valid: false, error: 'Debe tener al menos una mayúscula' };
			if (!rules.lower) return { valid: false, error: 'Debe tener al menos una minúscula' };
			if (!rules.number) return { valid: false, error: 'Debe tener al menos un número' };
			if (!rules.special) return { valid: false, error: 'Debe tener al menos un carácter especial' };
		}
		return { valid: true, error: null };
	};

	const fieldState = useFormField(name, value, validate);
	const strength = getPasswordStrength(rules);

	const ruleLabels: { [key: string]: string } = {
		length: 'Al menos 8 caracteres',
		upper: 'Al menos una mayúscula',
		lower: 'Al menos una minúscula',
		number: 'Al menos un número',
		special: 'Al menos un carácter especial',
	};

	return (
		<View>
			<FormInput
				value={value}
				onChangeText={onChangeText}
				placeholder='Contraseña'
				secureTextEntry
				error={fieldState.error ?? undefined}
				onFocus={() => setTouched(true)}
				onBlur={() => setBlurred(true)}
			/>

			{/* Barra de fuerza */}
			{isInRegister && touched && value.length > 0 ? (
				<View style={styles.strengthContainer}>
					<View style={styles.strengthBarBackground}>
						<View style={[styles.strengthBarFill, { width: strength.width, backgroundColor: strength.color }]} />
					</View>
					<Text style={[styles.strengthLabel, { color: strength.color }]}>{strength.label}</Text>
				</View>
			) : null}

			{isInRegister && touched && value.length > 0 ? (
				<View style={styles.rulesContainer}>
					{Object.keys(rules).map((key) => (
						<Text
							key={key}
							style={[styles.ruleText, { color: rules[key as keyof typeof rules] ? '#52c41a' : '#ff4d4f' }]}
						>
							{rules[key as keyof typeof rules] ? '✅' : '❌'} {ruleLabels[key]}
						</Text>
					))}
				</View>
			) : null}
		</View>
	);
};

export default PasswordInput;
