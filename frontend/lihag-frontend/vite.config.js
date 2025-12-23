import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: false,
    middlewareMode: false,
    allowedHosts: ['all', 'lihag.194.47.171.149.nip.io'],
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
  preview: {
    port: 5173,
  },
})
