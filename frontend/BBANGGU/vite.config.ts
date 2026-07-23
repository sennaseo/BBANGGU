import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import path from 'path'
import { VitePWA } from 'vite-plugin-pwa'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, '')
  const apiTarget = env.VITE_API_BASE_URL || 'http://localhost:8081'
  const aiTarget = env.VITE_AI_BASE_URL || 'http://localhost:8000'

  return {
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true // 개발 환경에서도 PWA 활성화
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      scope: '/',
      base: '/public',
      manifest: {
        name: '빵구앱',
        short_name: '빵구',
        description: '소비기한 임박 빵 할인 서비스',
        theme_color: '#FF9F43',
        background_color: '#ffffff',
        display: 'standalone',
        display_override: ["standalone", "fullscreen"],
        prefer_related_applications: false,
        icons: [
          {
            src: '/icon/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/icon/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/apple-touch-icon.png',  // iOS용 아이콘 추가
            sizes: '180x180',
            type: 'image/png'
          }
        ],
        shortcuts: [
          {
            name: "빵 등록하기",
            url: "/owner/bread/register",
            icons: [{ src: "/icon/icon-192x192.png", sizes: "192x192" }]
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true, // 0.0.0.0 — 같은 와이파이의 폰에서 PC IP로 접속 가능
    port: 5173,
    proxy: {
      '/uploads': {
        target: apiTarget,
        changeOrigin: true,
        secure: false,
      },
      '/ai': {
        target: aiTarget,
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/ai/, '')
      }
    },
  },
  preview: {
    host: '0.0.0.0',  // 또는 true
    port: 5173
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        }
      }
    }
  }
  }
})
