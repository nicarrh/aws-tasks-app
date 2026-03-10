export type RootStackParamList = {
	Auth: undefined;
	App: undefined;
	Security: undefined;
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
