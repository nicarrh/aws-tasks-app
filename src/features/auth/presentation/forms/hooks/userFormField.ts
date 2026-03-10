import { useEffect } from 'react';
import { useForm } from '../FormProvider';

export const useFormField = (
	name: string,
	value: string,
	validate: (val: string) => { valid: boolean; error?: string | null },
) => {
	const { setField } = useForm();
	const fieldState = validate(value);

	useEffect(() => {
		setField(name, { value, ...fieldState });
	}, [value, fieldState.valid, fieldState.error]);

	return fieldState;
};
