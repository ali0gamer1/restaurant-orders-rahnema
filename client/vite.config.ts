import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Forward API calls to the Express backend (npm run dev in the project root)
      '/health': 'http://localhost:3000',
      '/menu': 'http://localhost:3000',
      '/orders': 'http://localhost:3000',
      '/reservations': 'http://localhost:3000',
    },
  },
})
