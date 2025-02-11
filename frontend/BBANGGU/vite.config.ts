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
    host: 'localhost',  // 0.0.0.0 대신 localhost 사용
    port: 5173,
    proxy: {
      '/bread-package': {
        target: 'http://i12d102.p.ssafy.io:8081',
        changeOrigin: true,
        secure: false,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        },
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request:', req.method, req.url);
            // 요청 헤더 로깅
            console.log('Request Headers:', proxyReq.getHeaders());
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response:', proxyRes.statusCode, req.url);
            // 응답 바디 로깅
            let body = '';
            proxyRes.on('data', function(chunk) {
              body += chunk;
            });
            proxyRes.on('end', function() {
              console.log('Response body:', body);
            });
          });
        },
      }
    },
    hmr: {
      host: 'localhost'  // WebSocket 연결을 위한 호스트 설정
    },
  },
})
