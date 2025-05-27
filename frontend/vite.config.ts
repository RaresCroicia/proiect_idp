import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react()],
    base: env.VITE_BASE_URL || '/frontend/',
    server: {
      port: parseInt(env.VITE_PORT || '3000')
    },
    define: {
      'process.env': {
        VITE_API_URL: JSON.stringify(env.VITE_API_URL),
        VITE_AUTH_SERVICE_URL: JSON.stringify(env.VITE_AUTH_SERVICE_URL),
        VITE_COURSE_SERVICE_URL: JSON.stringify(env.VITE_COURSE_SERVICE_URL),
        VITE_BASE_URL: JSON.stringify(env.VITE_BASE_URL),
        VITE_SERVE_FROM_SUBPATH: JSON.stringify(env.VITE_SERVE_FROM_SUBPATH),
        VITE_PORT: JSON.stringify(env.VITE_PORT)
      }
    }
  }
})
