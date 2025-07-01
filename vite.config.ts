import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/neobpmn/', // Substitua pelo nome do seu repositório
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
