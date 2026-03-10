export const validateConfirmPassword = (password: string, confirmPassword: string) => {
	if (!confirmPassword) {
		return 'Debes confirmar la contraseña';
	}

	if (password !== confirmPassword) {
		return 'Las contraseñas no coinciden';
	}

	return '';
};
