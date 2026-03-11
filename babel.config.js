module.exports = {
	presets: ['babel-preset-expo'],
	plugins: [
		[
			'module-resolver',
			{
				root: ['./src'],
				alias: {
					'@navigation': './src/app/navigation/index.ts',
					'@auth': './src/features/auth/index.ts',
					'@tasks': './src/features/tasks/index.ts',
					'@profile': './src/features/profile/index.ts',
					'@shared': './src/shared/index.ts',
					'@users': './src/features/users/index.ts',
				},
			},
		],
		[
			'module:react-native-dotenv',
			{
				moduleName: '@env',
				path: '.env',
				safe: false,
				allowUndefined: true,
			},
		],
		'react-native-reanimated/plugin',
	],
};
