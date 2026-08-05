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
      // 자동 등록 스크립트를 주입하지 않는다.
      // base:'/public' 조합이 등록 스크립트 경로를 '/publicregisterSW.js'로 깨뜨려
      // (200 text/html = SPA 폴백 index.html) <head>에서 파싱 에러를 내며 앱 마운트를 막았음.
      // 매니페스트/아이콘 등 PWA 메타는 유지하되 SW 자동 등록만 끈다.
      injectRegister: false,
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      scope: '/',
      // 매니페스트는 index.html이 링크하는 public/manifest.json 하나만 쓴다
      // (플러그인이 manifest.webmanifest를 또 만들어 이중화되던 것 정리)
      manifest: false,
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
