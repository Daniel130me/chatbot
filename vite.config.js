import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'vite.svg',
        'pwa-icons/favicon.ico',
        'pwa-icons/apple-touch-icon-180x180.png',
        'offline.html'
      ],
      manifest: {
        name: 'LLM React App',
        short_name: 'LLM Chat',
        description: 'A React application powered by LLMs',
        theme_color: '#0ea5a4',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/pwa-icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/pwa-icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: '/pwa-icons/apple-touch-icon-180x180.png', sizes: '180x180', type: 'image/png', purpose: 'any' }
        ]
      },
      workbox: {
        navigateFallback: '/offline.html',
        runtimeCaching: [
          {
            urlPattern: /\/(api|openrouter)\//,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: { maxEntries: 50, maxAgeSeconds: 24 * 60 * 60 }
            }
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: { cacheName: 'image-cache', expiration: { maxEntries: 60, maxAgeSeconds: 30 * 24 * 60 * 60 } }
          }
        ]
      }
      
    })
  ],
})