export type RootStackParamList = {
	Auth: undefined;
	App: undefined;
};

export type AuthStackParamList = {
	Login: undefined;
	Register: undefined;
	ResetPassword: undefined;
	ConfirmCode: { email: string };
};

export type AppStackParamList = {
	Tasks: undefined;
	CreateTask: undefined;
	Profile: undefined;
};
