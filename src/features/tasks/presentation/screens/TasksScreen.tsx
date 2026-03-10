import { NavigationTheme } from '@shared'; // ajusta el path según tu proyecto
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SwipeListView } from 'react-native-swipe-list-view';
import Toast from 'react-native-toast-message';
import { useTasks } from '../../infraestructure/hooks/useTasks';

const { width } = Dimensions.get('window');
const RIGHT_OPEN_VALUE = width * 0.45;

export default function TasksScreen() {
	const { tasks, loading, addTask, updateTask, removeTask } = useTasks();
	const [newTask, setNewTask] = useState('');
	const [editingId, setEditingId] = useState<string | null>(null);
	const [editingText, setEditingText] = useState('');
	const [showAddTaskButton, setShowAddTaskButton] = useState(false);

	const swipeRef = useRef<SwipeListView<any>>(null);

	useEffect(() => {
		const validatePermissions = async () => {
			setShowAddTaskButton(false);
			const idToken = (await SecureStore.getItemAsync('idToken')) || '';
			const decoded = jwtDecode<{ 'cognito:groups'?: string[]; scope?: string }>(idToken);
			const canWrite = decoded.scope?.includes('tasks:write') || decoded['cognito:groups']?.includes('task-writers');
			if (canWrite) {
				// mostrar botón de "Crear tarea"
				setShowAddTaskButton(true);
			}
		};
		validatePermissions();
	}, []);

	const { colors } = NavigationTheme;
	const styles = createStyles(colors);

	if (loading) {
		return (
			<View style={styles.center}>
				<ActivityIndicator size='large' color={colors.primary} />
			</View>
		);
	}

	const handleAdd = () => {
		if (!newTask.trim()) return;
		addTask(newTask);
		setNewTask('');
	};

	const handleEdit = (id: string) => {
		updateTask(id, editingText);
		setEditingId(null);
		setEditingText('');
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.inputRow}>
				<TextInput
					placeholder='Nueva tarea'
					placeholderTextColor={colors.textSecondary}
					style={styles.input}
					value={newTask}
					onChangeText={setNewTask}
				/>
				{showAddTaskButton ? (
					<TouchableOpacity style={styles.addButton} onPress={handleAdd}>
						<Text style={styles.addText}>+</Text>
					</TouchableOpacity>
				) : null}
			</View>

			<SwipeListView
				ref={swipeRef}
				data={tasks}
				keyExtractor={(item) => item.taskId}
				renderItem={({ item }) => (
					<View style={styles.rowFront}>
						{editingId === item.taskId ? (
							<View style={styles.editRow}>
								<TextInput
									value={editingText}
									onChangeText={setEditingText}
									style={styles.editInput}
									autoFocus
									onSubmitEditing={() => handleEdit(item.taskId)}
									returnKeyType='done'
								/>
								<TouchableOpacity style={styles.confirmBtn} onPress={() => handleEdit(item.taskId)}>
									<Text style={styles.confirmText}>✔</Text>
								</TouchableOpacity>
							</View>
						) : (
							<Text style={styles.taskText}>{item.title}</Text>
						)}
					</View>
				)}
				renderHiddenItem={({ item }) => (
					<View style={styles.rowBack}>
						<TouchableOpacity
							style={styles.editBtn}
							onPress={() => {
								swipeRef.current?.closeAllOpenRows();
								setEditingId(item.taskId);
								setEditingText(item.title);
							}}
						>
							<Text style={styles.backText}>Editar</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.deleteBtn} onPress={() => removeTask(item.taskId)}>
							<Text style={styles.backText}>Borrar</Text>
						</TouchableOpacity>
					</View>
				)}
				leftOpenValue={75}
				rightOpenValue={-RIGHT_OPEN_VALUE}
			/>

			<Toast position='bottom' />
		</SafeAreaView>
	);
}

const createStyles = (colors: typeof NavigationTheme.colors) =>
	StyleSheet.create({
		container: { flex: 1, paddingTop: 50, backgroundColor: colors.background },
		center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
		inputRow: { flexDirection: 'row', padding: 10 },
		input: {
			flex: 1,
			borderWidth: 1,
			borderColor: '#d1d5db',
			borderRadius: 12,
			padding: 12,
			backgroundColor: colors.surface,
			color: colors.text,
		},
		addButton: {
			backgroundColor: colors.primary,
			padding: 12,
			borderRadius: 12,
			marginLeft: 10,
			justifyContent: 'center',
			alignItems: 'center',
		},
		addText: { color: '#fff', fontWeight: 'bold', fontSize: 22 },
		taskText: { fontSize: 16, color: colors.text },
		editRow: { flexDirection: 'row', alignItems: 'center', flex: 1 },
		editInput: {
			flex: 1,
			borderWidth: 1,
			borderColor: '#d1d5db',
			borderRadius: 12,
			padding: 10,
			backgroundColor: colors.surface,
			color: colors.text,
		},
		confirmBtn: {
			marginLeft: 8,
			backgroundColor: colors.success,
			borderRadius: 12,
			paddingHorizontal: 14,
			paddingVertical: 6,
		},
		confirmText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
		rowFront: {
			backgroundColor: colors.surface,
			borderBottomWidth: 1,
			borderColor: '#eee',
			paddingVertical: 15,
			paddingHorizontal: 20,
			justifyContent: 'center',
		},
		rowBack: {
			flex: 1,
			flexDirection: 'row',
			justifyContent: 'flex-end',
			alignItems: 'center',
			marginHorizontal: 10,
			height: 55,
		},
		deleteBtn: {
			backgroundColor: colors.error,
			width: 90,
			justifyContent: 'center',
			alignItems: 'center',
			borderRadius: 12,
			marginLeft: 8,
			height: '100%',
		},
		editBtn: {
			backgroundColor: colors.primary,
			width: 90,
			justifyContent: 'center',
			alignItems: 'center',
			borderRadius: 12,
			marginRight: 8,
			height: '100%',
		},
		backText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
	});
