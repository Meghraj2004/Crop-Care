import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { apiMiddleware } from './server/apiRouter.js';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'cropcare-api-server',
      configureServer(server) {
        server.middlewares.use(apiMiddleware);
      }
    }
  ],
  server: {
    port: 3000,
    open: true
  }
});
