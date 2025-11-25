import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  // Development: use proxy to localhost
  // Production: frontend will use VITE_BACKEND_URL environment variable
  const devBackendUrl = process.env.VITE_DEV_BACKEND_URL || 'http://localhost:3001'
  const prodBackendUrl = process.env.VITE_BACKEND_URL || process.env.VITE_PRODUCTION_BACKEND_URL

  return {
    plugins: [react(), tailwindcss()],
    server: {
      // Proxy only works in development mode
      proxy: mode === 'development' ? {
        '/api': {
          target: devBackendUrl,
          changeOrigin: true,
        },
      } : undefined,
    },
  }
})
