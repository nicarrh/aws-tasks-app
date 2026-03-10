import LottieView from 'lottie-react-native';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function Splash() {
	return (
		<View style={styles.container}>
			<LottieView
				source={require('../../../../assets/animations/app_lader.json')} // animación Lottie
				autoPlay
				loop
				style={{ width: width * 0.4, height: width * 0.4 }}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff', // minimalista, fondo blanco
		justifyContent: 'center',
		alignItems: 'center',
	},
});
