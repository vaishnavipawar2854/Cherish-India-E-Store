import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://cherish-india-e-store-backend.vercel.app',
        changeOrigin: true,
      },
    },
  },
})