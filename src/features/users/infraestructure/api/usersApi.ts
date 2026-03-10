const API_URL = process.env.USERS_API_URL;

export const apiUsers = async (path: string, options?: RequestInit) => {
	const res = await fetch(`${API_URL}${path}`, {
		headers: {
			'Content-Type': 'application/json',
			...options?.headers,
		},
		...options,
	});

	return res.json();
};
