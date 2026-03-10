import React, { useState } from 'react';
import { FormInput } from '../forms/FormInput';
import { useFormField } from '../forms/hooks/userFormField';

type Props = {
	value: string;
	onChangeText: (text: string) => void;
	password: string;
	name: string;
};

const ConfirmPasswordInput: React.FC<Props> = ({ value, onChangeText, password, name }) => {
	const [touched, setTouched] = useState(false);
	const [blurred, setBlurred] = useState(false);

	const validate = (val: string) => {
		if (!val) return { valid: false, error: touched && blurred ? 'Confirma tu contraseña' : null };
		if (val !== password) return { valid: false, error: 'Las contraseñas no coinciden' };
		return { valid: true, error: null };
	};

	const fieldState = useFormField(name, value, validate);

	return (
		<FormInput
			value={value}
			onChangeText={onChangeText}
			placeholder='Confirmar contraseña'
			secureTextEntry
			error={fieldState.error ?? undefined}
			onFocus={() => setTouched(true)}
			onBlur={() => setBlurred(true)}
		/>
	);
};

export default ConfirmPasswordInput;
