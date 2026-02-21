import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import { fileURLToPath, URL } from 'url'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [
    react(),
    visualizer({ filename: 'stats.html', template: 'treemap', gzipSize: true, brotliSize: true })
  ],
  server: {
    proxy: {
      '/api': 'http://127.0.0.1:5000'
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (
              id.includes('/react/') ||
              id.includes('/react-dom/') ||
              id.includes('/react-router/') ||
              id.includes('/react-router-dom/')
            ) {
              return 'react-vendor'
            }
            if (id.includes('/axios/')) return 'axios'
            return 'vendor'
          }
        }
      }
    }
  }
})
