import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  worker: {
    format: "es" // 🔥 REQUIRED
  },
  plugins: [react()],
})
