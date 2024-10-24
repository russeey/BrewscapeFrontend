import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  server: {
    host: "0.0.0.0",
    port: 3000,
    hmr: {
      protocol: "ws",
      host: "192.168.56.1",
      clientPort: 3000,
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
