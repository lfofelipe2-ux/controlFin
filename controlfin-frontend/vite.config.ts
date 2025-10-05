import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Suprimir warnings de compatibilidade do Ant Design com React 19
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
  },
  esbuild: {
    // Suprimir warnings específicos do Ant Design com React 19
    // Este warning é cosmético e não afeta funcionalidade
    // TODO: Remover quando Ant Design 6.0 for estável
    logOverride: {
      'this-is-undefined-in-esm': 'silent',
    },
  },
  // Configuração adicional para desenvolvimento
  server: {
    port: 5173,
    host: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
  },
});
