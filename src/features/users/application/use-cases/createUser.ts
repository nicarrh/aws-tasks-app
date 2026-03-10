import { UserApiRepository } from '../../infraestructure/repository/UserApiRepository';

export const createUser = async (user: any, token: string) => {
	return UserApiRepository.createUser(user, token);
};
