// useTasks.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';
import * as api from '../api/tasksApi';

type Task = { taskId: string; title: string };

const TASKS_KEY = '@tasks_cache';
const MAX_RETRIES = 3;

let inMemoryCache: Task[] = [];

export function useTasks() {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<{ message: string; hasError: boolean }>({ message: '', hasError: false });

	const loadTasks = async (retries = 0): Promise<void> => {
		setLoading(true);

		try {
			const { data } = await api.getTasks();
			setTasks(data);
			inMemoryCache = data;
			await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(data));
			setLoading(false);
		} catch (err: any) {
			console.error('[useTasks]:', err);

			// Retry only for 5xx
			const status = err?.response?.status;
			if (status && status >= 500 && status < 600 && retries < MAX_RETRIES) {
				const delay = Math.pow(2, retries) * 500; // 500ms, 1000ms, 2000ms
				console.log(`[useTasks]: Retry #${retries + 1} in ${delay}ms`);
				setTimeout(() => loadTasks(retries + 1), delay);
				return;
			}

			// Si no hay retries o error no es 5xx
			setError({ message: 'Error cargando tareas', hasError: true });
			Toast.show({
				text1: 'Error cargando tareas',
				type: 'error',
			});
			// Intentar cache local
			if (inMemoryCache.length > 0) {
				setTasks(inMemoryCache);
			} else {
				const cached = await AsyncStorage.getItem(TASKS_KEY);
				if (cached) setTasks(JSON.parse(cached));
			}

			setLoading(false);
		}
	};

	const addTask = async (title: string) => {
		try {
			await api.addTask(title);
			await loadTasks(); // refrescar cache
		} catch (e) {
			setError({ message: 'Error creando tarea', hasError: true });
			Toast.show({
				text1: 'Error creando tarea',
				type: 'error',
			});
		}
	};

	const updateTask = async (taskId: string, title: string) => {
		try {
			await api.updateTask(taskId, title);
			await loadTasks();
		} catch (e) {
			setError({ message: 'Error actualizando tarea', hasError: true });
			Toast.show({
				text1: 'Error actualizando tarea',
				type: 'error',
			});
		}
	};

	const removeTask = async (taskId: string) => {
		try {
			await api.deleteTask(taskId);
			await loadTasks();
		} catch (e) {
			setError({ message: 'Error eliminando tarea', hasError: true });
			Toast.show({
				text1: 'Error eliminando tarea',
				type: 'error',
			});
		}
	};

	useEffect(() => {
		// cargar cache de AsyncStorage primero
		(async () => {
			const cached = await AsyncStorage.getItem(TASKS_KEY);
			if (cached) {
				const parsed: Task[] = JSON.parse(cached);
				setTasks(parsed);
				inMemoryCache = parsed;
			}
			loadTasks();
		})();
	}, []);

	return { tasks, loading, addTask, updateTask, removeTask, error };
}
