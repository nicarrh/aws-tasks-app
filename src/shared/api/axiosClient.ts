import { getValidAccessToken } from '@auth';
import { TASKS_API_URL, USERS_API_URL } from '@env';
import axios, { AxiosInstance, AxiosRequestHeaders, InternalAxiosRequestConfig } from 'axios';

export type BaseUrls = 'users' | 'tasks';

const BASE_URLS: Record<BaseUrls, string> = {
	users: USERS_API_URL || '',
	tasks: TASKS_API_URL || '',
};

export const createAuthClient = (base: BaseUrls): AxiosInstance => {
	const instance = axios.create({
		baseURL: BASE_URLS[base],
	});

	instance.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
		const token = await getValidAccessToken();
		if (!token) throw new Error('Token expirado');
		if (!config.headers) {
			config.headers = {} as AxiosRequestHeaders;
		}
		(config.headers as AxiosRequestHeaders)['Authorization'] = `Bearer ${token}`;
		return config;
	});

	return instance;
};
