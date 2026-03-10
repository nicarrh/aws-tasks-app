import { useTheme } from '@react-navigation/native';
import { StyleSheet } from 'react-native';

const styles = () => {
	const { colors } = useTheme();

	return StyleSheet.create({
		container: {
			flex: 1,
			padding: 24,
		},
		content: {
			flex: 1,
			justifyContent: 'center',
			gap: 16,
		},

		title: {
			fontSize: 28,
			fontWeight: 'bold',
			color: colors.text,
			marginBottom: 16,
		},

		subtitle: {
			fontSize: 16,
			color: colors.text,
		},

		email: {
			fontSize: 16,
			fontWeight: '600',
			color: colors.primary,
			marginBottom: 20,
		},

		input: {
			borderWidth: 1,
			borderColor: colors.border,
			padding: 14,
			borderRadius: 10,
			marginBottom: 20,
			color: colors.text,
		},

		button: {
			backgroundColor: colors.primary,
			padding: 16,
			borderRadius: 10,
			alignItems: 'center',
		},

		buttonText: {
			color: '#fff',
			fontWeight: 'bold',
			fontSize: 16,
		},

		link: {
			marginTop: 20,
			color: colors.primary,
			textAlign: 'center',
		},
	});
};

export default styles;
