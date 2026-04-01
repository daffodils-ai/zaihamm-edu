import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,       // change to your desired port
    host: true,       // optional: exposes server on local network
    open: true        // optional: auto-open browser
  }
})
