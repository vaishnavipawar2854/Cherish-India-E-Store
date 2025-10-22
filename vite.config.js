import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://cherish-india-e-store-backend-72t1.vercel.app',
        changeOrigin: true,
      },
    },
  },
})