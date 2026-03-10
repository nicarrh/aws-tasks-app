export const getPasswordStrength = (rules: any) => {
	const passed = Object.values(rules).filter(Boolean).length;

	if (passed <= 2) {
		return { label: 'Débil', color: '#ff4d4f', width: '30%' };
	}

	if (passed <= 4) {
		return { label: 'Media', color: '#faad14', width: '60%' };
	}

	return { label: 'Fuerte', color: '#52c41a', width: '100%' };
};
