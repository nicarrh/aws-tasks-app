import { Theme } from '@react-navigation/native';
import { StyleSheet } from 'react-native';

const createStyles = (colors: Theme['colors']) =>
	StyleSheet.create({
		strengthContainer: {
			marginTop: 8,
		},
		strengthBarBackground: {
			height: 6,
			backgroundColor: colors.card,
			borderRadius: 3,
			overflow: 'hidden',
		},
		strengthBarFill: {
			height: '100%',
			borderRadius: 3,
		},
		strengthLabel: {
			marginTop: 4,
			fontSize: 12,
			fontWeight: 'bold',
		},
		rulesContainer: {
			marginTop: 8,
			paddingLeft: 8,
		},
		ruleText: {
			fontSize: 12,
			marginBottom: 2,
		},
	});

export default createStyles;
