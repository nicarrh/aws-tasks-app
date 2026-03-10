import { DefaultTheme } from '@react-navigation/native';
import { colors } from './colors';

export const NavigationTheme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		primary: colors.primary,
		background: colors.background,
		card: colors.surface,
		text: colors.text,
		border: '#E3E5EC',
		notification: colors.accent,

		secondary: colors.secondary,
		accent: colors.accent,
		surface: colors.surface,
		textSecondary: colors.textSecondary,
		success: colors.success,
		warning: colors.warning,
		error: colors.error,
	},
};
