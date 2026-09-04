import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const createTimeApiProxy = () => ({
	target: 'https://timeapi.io',
	changeOrigin: true,
	rewrite: (path: string) => path.replace(/^\/api\/time/, '/api/v1/timezone/zone'),
});

export default defineConfig({
	plugins: [react(), tailwindcss()],
	server: {
		proxy: {
			'/api/time': createTimeApiProxy(),
		},
	},
	preview: {
		proxy: {
			'/api/time': createTimeApiProxy(),
		},
	},
});
