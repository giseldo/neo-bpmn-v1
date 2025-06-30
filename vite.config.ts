import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/neo-bpmn-v1/', // Substitua pelo nome do seu repositório
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
