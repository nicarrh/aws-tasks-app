import { useAuth } from '@/features/auth/hooks/useAuth';
import { Button, Modal, Text, View } from 'react-native';

const ModalTotp = () => {
	const { showTotpPrompt, declineTotp, acceptTotp } = useAuth();

	if (!showTotpPrompt) return null;

	return (
		<Modal transparent>
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<View style={{ backgroundColor: '#fff', padding: 20 }}>
					<Text>¿Quieres activar verificación en dos pasos?</Text>

					<Button title='Activar' onPress={acceptTotp} />

					<Button title='Ahora no' onPress={declineTotp} />
				</View>
			</View>
		</Modal>
	);
};
export default ModalTotp;
