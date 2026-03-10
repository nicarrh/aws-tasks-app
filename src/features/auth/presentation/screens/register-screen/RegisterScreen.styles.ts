import { Theme } from '@react-navigation/native';
import { StyleSheet } from 'react-native';

const styles = (colors: Theme['colors']) =>
	StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: colors.background,
			padding: 24,
		},
		formContent: {
			justifyContent: 'center',
			gap: 16,
			flex: 1,
		},

		title: {
			fontSize: 32,
			fontWeight: 'bold',
			color: colors.text,
			marginBottom: 32,
		},

		input: {
			height: 50,
			borderRadius: 10,
			borderWidth: 1,
			borderColor: colors.border,
			backgroundColor: colors.card,
			paddingHorizontal: 16,
			color: colors.text,
		},
		inputError: {
			borderColor: '#FF4D4F',
			borderWidth: 1,
		},
		errorText: {
			color: '#FF4D4F',
			fontSize: 12,
			marginTop: -12,
			marginBottom: 12,
			marginLeft: 4,
		},

		button: {
			height: 50,
			borderRadius: 10,
			backgroundColor: colors.primary,
			justifyContent: 'center',
			alignItems: 'center',
			marginTop: 10,
		},

		buttonText: {
			color: colors.surface,
			fontSize: 16,
			fontWeight: '600',
		},

		footer: {
			marginTop: 20,
			alignItems: 'center',
		},

		linkText: {
			color: colors.primary,
			fontWeight: '600',
		},
	});

export default styles;
