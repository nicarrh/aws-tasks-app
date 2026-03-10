import { Theme } from '@react-navigation/native';
import { StyleSheet } from 'react-native';

const styles = (colors: Theme['colors']) =>
	StyleSheet.create({
		container: {
			flex: 1,
			alignItems: 'flex-start',
			justifyContent: 'center',
			padding: 24,
		},
		input: {
			borderRadius: 6,
			padding: 16,
			width: '100%',
		},
		buttons: { flex: 0.3, justifyContent: 'flex-end', alignItems: 'center', gap: 16 },
		label: { fontSize: 12, fontWeight: '300' },
		content: { gap: 8, width: '100%', flex: 0.7, justifyContent: 'center' },
		spacing: { gap: 8 },
		primaryBtn: {
			padding: 16,
			width: '100%',
			borderRadius: 6,
			alignItems: 'center',
			backgroundColor: colors.primary,
		},
		btnText: { fontWeight: '600', color: colors.surface },
		btnRegister: {
			borderColor: colors.border,
			borderWidth: 1,
			opacity: 0.7,
			padding: 16,
			width: '100%',
			borderRadius: 6,
			alignItems: 'center',
		},
		btnRegisterText: {
			fontWeight: '600',
			color: colors.text,
		},
	});
export default styles;
