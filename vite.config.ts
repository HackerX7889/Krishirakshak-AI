import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const API_TARGET = process.env.API_TARGET ?? 'http://localhost:4000'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: ['.loca.lt', '.trycloudflare.com'],
    // Leaf photos go to our own API (which holds the AI key server-side)
    proxy: {
      '/api': { target: API_TARGET, changeOrigin: true },
    },
  },
  preview: {
    allowedHosts: ['.loca.lt', '.trycloudflare.com'],
    proxy: {
      '/api': { target: API_TARGET, changeOrigin: true },
    },
  },
})
