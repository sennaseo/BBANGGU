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
    host: 'localhost',
    port: 5173,
    proxy: {
      '/bread-package': {
        target: 'http://i12d102.p.ssafy.io:8081',
        changeOrigin: true,
        secure: false,
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, _req, _res) => {
            proxyReq.removeHeader('origin');
            proxyReq.removeHeader('referer');
          });

          proxy.on('proxyRes', (_proxyRes, _req, res) => {
            // CORS 헤더 중복 설정 방지
            res.removeHeader('Access-Control-Allow-Origin');
            res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            res.setHeader('Access-Control-Allow-Credentials', 'true');
          });
        }
      },
      // bread API를 위한 새로운 프록시 설정 추가
      '/bread': {
        target: 'http://i12d102.p.ssafy.io:8081',
        changeOrigin: true,
        secure: false,
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, _req, _res) => {
            proxyReq.removeHeader('origin');
            proxyReq.removeHeader('referer');
          });

          proxy.on('proxyRes', (_proxyRes, _req, res) => {
            res.removeHeader('Access-Control-Allow-Origin');
            res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            res.setHeader('Access-Control-Allow-Credentials', 'true');
          });
        }
      }
    },
    hmr: {
      host: 'localhost'  // WebSocket 연결을 위한 호스트 설정
    },
  },
})
