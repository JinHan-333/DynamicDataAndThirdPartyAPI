import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api/deepl': {
        target: 'https://api-free.deepl.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/deepl/, ''),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            proxyReq.removeHeader('origin');
          });
        },
      },
      '/api/recipes': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
