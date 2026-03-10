import { apiUsers } from '../api/usersApi';

export const UserApiRepository = {
	createUser: async (user: any, token: string) => {
		return apiUsers('/users', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(user),
		});
	},

	getUser: async (userId: string) => {
		return apiUsers(`/users/${userId}`);
	},
};
