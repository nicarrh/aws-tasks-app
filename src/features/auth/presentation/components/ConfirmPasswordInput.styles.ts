import { Theme } from '@react-navigation/native';
import { StyleSheet } from 'react-native';

const createStyles = (colors: Theme['colors']) =>
	StyleSheet.create({
		container: {
			flexDirection: 'row',
			alignItems: 'center',
			height: 50,
			borderRadius: 10,
			borderWidth: 1,
			paddingHorizontal: 16,
			borderColor: colors.border,
			backgroundColor: colors.card,
		},
	});

export default createStyles;
