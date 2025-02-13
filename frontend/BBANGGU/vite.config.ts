import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { VitePWA } from 'vite-plugin-pwa'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: '빵구앱',
        short_name: '빵구',
        description: '소비기한 임박 빵 할인 서비스',
        theme_color: '#FF9F43',
        icons: [
          {
            src: 'icon/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icon/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/bread-package': {
        target: 'https://i12d102.p.ssafy.io',
        changeOrigin: true,
        secure: true,
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, _req, _res) => {
            proxyReq.removeHeader('origin');
            proxyReq.removeHeader('referer');
          });

          proxy.on('proxyRes', (_proxyRes, _req, res) => {
            res.removeHeader('Access-Control-Allow-Origin');
            res.setHeader('Access-Control-Allow-Origin', 'https://i12d102.p.ssafy.io');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            res.setHeader('Access-Control-Allow-Credentials', 'true');
          });
        }
      },
      '/bread': {
        target: 'https://i12d102.p.ssafy.io',
        changeOrigin: true,
        secure: true,
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, _req, _res) => {
            proxyReq.removeHeader('origin');
            proxyReq.removeHeader('referer');
          });

          proxy.on('proxyRes', (_proxyRes, _req, res) => {
            res.removeHeader('Access-Control-Allow-Origin');
            res.setHeader('Access-Control-Allow-Origin', 'https://i12d102.p.ssafy.io');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            res.setHeader('Access-Control-Allow-Credentials', 'true');
          });
        }
      }
    }
  },
})
