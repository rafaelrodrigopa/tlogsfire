import { defineConfig } from 'vite'; // Importe esta linha
import react from '@vitejs/plugin-react';

// Configuração correta
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Opcional: define a porta
    proxy: {    // Opcional: configura proxy se necessário
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
});