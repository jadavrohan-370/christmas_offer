import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/google-script': {
        target: 'https://script.google.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/google-script/, '/macros/s/AKfycbzMW6XwWg_wERt5zlXsLcGqKN8HK5g7JSvacijYT-T2Zn5RjaEjQn0KzIb-QlQxM6ag5Q/exec'),
      },
    },
  },
});