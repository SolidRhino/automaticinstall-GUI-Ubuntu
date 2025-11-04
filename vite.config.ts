import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  // Base path for GitHub Pages (set to your repo name)
  // For example: if your repo is "ubuntu-autoinstall", use '/ubuntu-autoinstall/'
  // For custom domain or user.github.io, use '/'
  base: process.env.GITHUB_PAGES ? '/automaticinstall-GUI-Ubuntu/' : '/',

  plugins: [
    // React plugin with Fast Refresh
    react(),

    // PWA plugin for offline support and installability
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'Ubuntu Autoinstall Configuration Builder',
        short_name: 'Autoinstall',
        description: 'Create and customize Ubuntu autoinstall configurations',
        theme_color: '#E95420',
        background_color: '#FFFFFF',
        display: 'standalone',
        icons: [
          {
            src: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"%3E%3Crect fill="%23E95420" width="192" height="192" rx="24"/%3E%3Ctext x="96" y="135" font-size="100" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-weight="bold"%3EU%3C/text%3E%3C/svg%3E',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          },
          {
            src: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"%3E%3Crect fill="%23E95420" width="512" height="512" rx="64"/%3E%3Ctext x="256" y="370" font-size="280" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-weight="bold"%3EU%3C/text%3E%3C/svg%3E',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        // Cache all assets
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ],

  // Resolve aliases
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },

  // Build options
  build: {
    outDir: 'dist',
    sourcemap: true,
    // Rollup options
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'yaml-vendor': ['js-yaml'],
          'crypto-vendor': ['crypto-js'],
          'intro-vendor': ['intro.js']
        }
      }
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000
  },

  // Server options for development
  server: {
    port: 3000,
    open: true
  },

  // Preview server options
  preview: {
    port: 4173,
    open: true
  }
});
