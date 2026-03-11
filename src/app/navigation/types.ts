export type RootStackParamList = {
	Auth: undefined;
	App: undefined;
	Security: {
		screen: keyof SecurityStackParamList;
		params?: undefined;
	};
};

export type SecurityStackParamList = {
	SetupTotp: undefined;
	ConfirmTotp: undefined;
};

export type AuthStackParamList = {
	Login: undefined;
	Register: undefined;
	ResetPassword: undefined;
	ConfirmCode: { email: string };
	ConfirmTotp: undefined;
	ForgotPassword: undefined;
};

export type AppStackParamList = {
	Tasks: undefined;
	Profile: undefined;
};
