import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build' // Set the out dir for build
  },
  server: {
    host: true, // This makes the server accessible externally
    port: 5173, // Optional: specify the port
    watch: {
      usePolling: true,
    },
    hmr: {
      overlay: true,
    },
  }
})


