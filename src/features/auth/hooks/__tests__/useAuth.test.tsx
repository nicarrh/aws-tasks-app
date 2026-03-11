import { act, renderHook, waitFor } from '@testing-library/react-native';
import React from 'react';
import { AuthProvider, useAuth } from '../useAuth';

const mockNavigate = jest.fn();
const mockGetState = jest.fn();
jest.mock('@react-navigation/native', () => {
	const actualNav = jest.requireActual('@react-navigation/native');
	return {
		...actualNav,
		useNavigation: () => ({
			dispatch: jest.fn(),
			navigate: mockNavigate,
			getState: mockGetState,
		}),
	};
});

// Mock AWS Amplify (para que no intente llamar nada real)
jest.mock('@aws-amplify/auth', () => ({}));

// Mock SecureStore
jest.mock('expo-secure-store', () => ({
	getItemAsync: jest.fn(),
	setItemAsync: jest.fn(),
	deleteItemAsync: jest.fn(),
}));

// Mock AWS Cognito repository
jest.mock('../../infraestructure/cognito/auth.repository', () => ({
	loginUser: jest.fn(),
	logoutUser: jest.fn(),
	registerUser: jest.fn(),
	confirmUser: jest.fn(),
	resetPassword: jest.fn(),
	confirmResetPassword: jest.fn(),
}));

const { loginUser, logoutUser } = require('../../infraestructure/cognito/auth.repository');
const SecureStore = require('expo-secure-store');

// -----------------------
// Tests
// -----------------------

describe('useAuth hook - full tests', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		SecureStore.getItemAsync.mockResolvedValue(null);
		SecureStore.setItemAsync.mockResolvedValue();
		SecureStore.deleteItemAsync.mockResolvedValue();
	});

	it('should provide default state', async () => {
		const { result } = renderHook(() => useAuth(), {
			wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
		});

		await waitFor(() => {
			expect(result.current.loadingSplash).toBe(false);
			expect(result.current.isUserLogged).toBe(false);
			expect(result.current.loading).toBe(false);
			expect(result.current.error).toBeNull();
		});
	});

	it('should set loadingSplash to false if no tokens', async () => {
		SecureStore.getItemAsync.mockResolvedValueOnce(null);

		const { result } = renderHook(() => useAuth(), {
			wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
		});

		await waitFor(() => expect(result.current.loadingSplash).toBe(false));
	});

	it('login should set isUserLogged to true on success', async () => {
		loginUser.mockResolvedValue({
			type: 'SUCCESS',
			tokens: {
				accessToken: 'access',
				refreshToken: 'refresh',
				idToken: 'id',
			},
		});

		const { result } = renderHook(() => useAuth(), {
			wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
		});

		await act(async () => {
			const res = await result.current.login('test@example.com', 'password');
			expect(res.success).toBe(true);
		});

		expect(result.current.isUserLogged).toBe(true);
		expect(SecureStore.setItemAsync).toHaveBeenCalledWith('accessToken', 'access');
		expect(SecureStore.setItemAsync).toHaveBeenCalledWith('refreshToken', 'refresh');
		expect(SecureStore.setItemAsync).toHaveBeenCalledWith('idToken', 'id');
	});

	it('logout should set isUserLogged to false', async () => {
		const { result } = renderHook(() => useAuth(), {
			wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
		});

		await act(async () => {
			await result.current.logout();
		});

		expect(result.current.isUserLogged).toBe(false);
		expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('accessToken');
		expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('refreshToken');
		expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('idToken');
	});
});
