import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: false,
    middlewareMode: false,
    allowedHosts: ['all', 'lihag.172.27.60.122.nip.io'],
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
  preview: {
    port: 5173,
  },
})
