import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: [".loca.lt", ".trycloudflare.com"],
  },
  preview: {
    allowedHosts: [".loca.lt", ".trycloudflare.com"],
  },
})