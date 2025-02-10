import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true, // 모든 네트워크 인터페이스에서 접근 허용
    port: 5173,  // 기본 포트
    proxy: {
      '/bread-package': {
        target: 'http://i12d102.p.ssafy.io:8081',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/bread-package/, '/bread-package')
      }
    }
  },
})
