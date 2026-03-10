import React, { useState } from 'react';
import { FormInput } from '../forms/FormInput';
import { useFormField } from '../forms/hooks/userFormField';

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

type Props = {
	value: string;
	onChangeText: (text: string) => void;
	name: string;
};

const EmailInput: React.FC<Props> = ({ value, onChangeText, name }) => {
	const [touched, setTouched] = useState(false);
	const [blurred, setBlurred] = useState(false);

	const validate = (val: string) => {
		if (!val) return { valid: false, error: touched && blurred ? 'El correo es obligatorio' : null };
		if (!isValidEmail(val)) return { valid: false, error: 'Correo inválido' };
		return { valid: true, error: null };
	};

	const fieldState = useFormField(name, value, validate);

	return (
		<FormInput
			value={value}
			onChangeText={onChangeText}
			placeholder='Correo electrónico'
			error={fieldState.error ?? undefined}
			onBlur={() => setBlurred(true)}
			onFocus={() => setTouched(true)}
		/>
	);
};

export default EmailInput;
