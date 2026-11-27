import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: Number(process.env.PORT) || 5180,
    // In dev, AI calls go to the deployed PHP proxy (the key only exists on the server).
    proxy: { '/api': { target: 'https://borisbelov.com', changeOrigin: true, rewrite: (p) => `/dev/contrast${p}` } },
  },
})
