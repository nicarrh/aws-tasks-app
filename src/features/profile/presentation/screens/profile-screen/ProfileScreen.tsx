import { useAuth } from '@auth';
import { NavigationTheme } from '@shared';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

type IdTokenClaims = {
	sub: string;
	email?: string;
	'cognito:groups'?: string[];
	[key: string]: any;
};

const ProfileScreen = () => {
	const { logout } = useAuth();
	const [claims, setClaims] = useState<IdTokenClaims | null>(null);
	const [loading, setLoading] = useState(true);
	const { colors } = NavigationTheme;
	const styles = createStyles(colors);

	useEffect(() => {
		const loadClaims = async () => {
			const idToken = await SecureStore.getItemAsync('idToken');
			if (idToken) {
				const decoded = jwtDecode<IdTokenClaims>(idToken);
				setClaims(decoded);
			}
			setLoading(false);
		};

		loadClaims();
	}, []);

	const forceReAuth = async () => {
		await logout();
		Toast.show({
			type: 'info',
			text1: 'Sesión reiniciada',
			text2: 'Vuelve a iniciar sesión para ver datos protegidos.',
		});
	};

	if (loading) {
		return (
			<View style={styles.center}>
				<ActivityIndicator size='large' color={colors.primary} />
			</View>
		);
	}

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<ScrollView style={styles.container}>
				<Text style={styles.title}>Perfil del usuario</Text>
				{claims ? (
					<View style={styles.claimsContainer}>
						{Object.entries(claims).map(([key, value]) => (
							<View key={key} style={styles.claimCard}>
								<Text style={styles.claimKey}>{key}</Text>
								<Text style={styles.claimValue}>{Array.isArray(value) ? value.join(', ') : value}</Text>
							</View>
						))}
					</View>
				) : (
					<Text style={styles.noDataText}>No hay información disponible</Text>
				)}

				<TouchableOpacity style={styles.reAuthButton} onPress={forceReAuth}>
					<Text style={styles.reAuthText}>Forzar Re-Auth</Text>
				</TouchableOpacity>

				<Toast position='bottom' />
			</ScrollView>
		</SafeAreaView>
	);
};

const createStyles = (colors: typeof NavigationTheme.colors) =>
	StyleSheet.create({
		container: { flex: 1, padding: 20, backgroundColor: colors.background },
		center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
		title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: colors.primary },
		claimsContainer: { marginBottom: 30 },
		claimCard: {
			backgroundColor: colors.surface,
			padding: 15,
			borderRadius: 12,
			marginBottom: 12,
			shadowColor: '#000',
			shadowOpacity: 0.05,
			shadowRadius: 4,
			shadowOffset: { width: 0, height: 2 },
			elevation: 2,
		},
		claimKey: { fontWeight: '700', color: colors.textSecondary, marginBottom: 4, fontSize: 14 },
		claimValue: { color: colors.text, fontSize: 16 },
		noDataText: { color: colors.textSecondary, fontStyle: 'italic', textAlign: 'center', marginVertical: 20 },
		reAuthButton: {
			backgroundColor: colors.accent,
			padding: 15,
			borderRadius: 12,
			alignItems: 'center',
			marginTop: 10,
		},
		reAuthText: { color: colors.surface, fontWeight: 'bold', fontSize: 16 },
	});

export default ProfileScreen;
