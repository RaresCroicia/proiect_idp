import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {
      VITE_API_URL: JSON.stringify(process.env.VITE_API_URL || 'http://188.245.104.79'),
      VITE_AUTH_SERVICE_URL: JSON.stringify(process.env.VITE_AUTH_SERVICE_URL || 'http://188.245.104.79/auth'),
      VITE_COURSE_SERVICE_URL: JSON.stringify(process.env.VITE_COURSE_SERVICE_URL || 'http://188.245.104.79/courses'),
      VITE_BASE_URL: JSON.stringify(process.env.VITE_BASE_URL || '/frontend'),
      VITE_SERVE_FROM_SUBPATH: JSON.stringify(process.env.VITE_SERVE_FROM_SUBPATH || 'true'),
      VITE_PORT: JSON.stringify(process.env.VITE_PORT || '3000')
    }
  }
})
