import { cloudflare } from '@cloudflare/vite-plugin';
import { reactRouter } from '@react-router/dev/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		cloudflare({
			viteEnvironment: { name: 'ssr' },
		}),
		reactRouter(),
		// mantineTheme({
		// 	input: "./app/modules/theme.ts",
		// 	output: './app/styles/mantine.css',
		// }),
	],
	resolve: {
		tsconfigPaths: true,
	},
});
