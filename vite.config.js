import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: process.env.PORT || 5173,
    strictPort: false,
    allowedHosts: [
      'cherish-india-e-store.onrender.com',
      '.onrender.com',
      'localhost',
      '.vercel.app'
    ],
    proxy: {
      '/api': {
        target: 'cherish-india-e-store-backend-72t1.vercel.app',
        changeOrigin: true,
      },
    },
  },
  preview: {
    host: '0.0.0.0',
    port: process.env.PORT || 4173,
    strictPort: false,
    allowedHosts: [
      'cherish-india-e-store.onrender.com',
      '.onrender.com',
      'localhost',
      '.vercel.app'
    ],
  },
})