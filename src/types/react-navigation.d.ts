import '@react-navigation/native';

declare module '@react-navigation/native' {
	export interface Theme {
		colors: {
			primary: string;
			background: string;
			card: string;
			text: string;
			border: string;
			notification: string;

			secondary: string;
			accent: string;
			surface: string;
			textSecondary: string;

			success: string;
			warning: string;
			error: string;
		};
	}
}
