import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// During development the client proxies /api to the Express server.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
});
