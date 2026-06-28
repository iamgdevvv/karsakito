module.exports = {
	plugins: {
		'postcss-preset-mantine': {},
		'postcss-simple-vars': {
			variables: {
				'mantine-breakpoint-xs': '361px',
				'mantine-breakpoint-sm': '601px',
				'mantine-breakpoint-md': '901px',
				'mantine-breakpoint-lg': '1200px',
				'mantine-breakpoint-xl': '1600px',
			},
		},
		// 'tailwind-preset-mantine/postcss': {
		// 	input: './app/modules/theme.ts',
		// },
		'@tailwindcss/postcss': {},
		autoprefixer: {},
	},
};
