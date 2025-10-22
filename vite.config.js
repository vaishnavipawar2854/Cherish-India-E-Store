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
        target: process.env.VITE_API_URL || 'https://cherish-india-e-store-backend.onrender.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path
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
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'https://cherish-india-e-store-backend.onrender.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path
      },
    },
  },
})