import React, { createContext, useContext, useState } from 'react';

type FieldState = {
	value: string;
	valid: boolean;
	error?: string | null;
};

type FormContextType = {
	fields: Record<string, FieldState>;
	setField: (name: string, state: FieldState) => void;
};

const FormContext = createContext<FormContextType | undefined>(undefined);

export const useForm = () => {
	const context = useContext(FormContext);
	if (!context) throw new Error('useForm must be used inside FormProvider');
	return context;
};

export const FormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [fields, setFields] = useState<Record<string, FieldState>>({});

	const setField = (name: string, state: FieldState) => {
		setFields((prev) => ({ ...prev, [name]: state }));
	};

	return <FormContext.Provider value={{ fields, setField }}>{children}</FormContext.Provider>;
};
