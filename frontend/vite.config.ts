import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import basicSsl from '@vitejs/plugin-basic-ssl'

const backendTarget = process.env.BACKEND_URL ?? 'http://localhost:5500'
const useHttps = process.env.VITE_NO_SSL !== 'true'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react(), ...(useHttps ? [basicSsl()] : [])],
  server: {
    host: true,
    allowedHosts: ['marsai.lightchurch.fr'],
    proxy: {
      '/api': {
        target: backendTarget,
        changeOrigin: true,
      },
      '/socket.io': {
        target: backendTarget,
        changeOrigin: true,
        ws: true,
        secure: false,
      },
      '/uploads': {
        target: backendTarget,
        changeOrigin: true,
      },
    },
    hmr: {
      clientPort: 5173,
    },
    watch: {
      usePolling: true,
      interval: 100,
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
    globals: true,
    testTimeout: 15000,
  },
})
