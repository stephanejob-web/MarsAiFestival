import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react(), basicSsl()],
  server: {
    host: true,
    proxy: {
      '/api': {
        target: 'http://backend:5500',
        changeOrigin: true,
      },
      '/socket.io': {
        target: 'http://backend:5500',
        changeOrigin: true,
        ws: true,
        secure: false,
      },
      '/uploads': {
        target: 'http://backend:5500',
        changeOrigin: true,
      },
    },
    watch: {
      usePolling: true,
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
    globals: true,
  },
})
