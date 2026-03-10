import { createAuthClient } from '@shared';

const taskAPI = createAuthClient('tasks');

export async function getTasks() {
	const res = await taskAPI.get('/tasks');
	return res.data;
}

export async function addTask(title: string) {
	const res = await taskAPI.post('/tasks', { title });
	return res.data;
}

export async function updateTask(id: string, title: string) {
	const res = await taskAPI.put(`/tasks/${id}`, { title });
	return res.data;
}

export async function deleteTask(id: string) {
	console.log('delete id', id);
	const res = await taskAPI.delete(`/tasks/${id}`);
	return res.data;
}
