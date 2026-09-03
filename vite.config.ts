import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true
  },
  build: {
    target: 'esnext',
    cssCodeSplit: true,
    sourcemap: false,
    chunkSizeWarningLimit: 400,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.warn', 'console.info'],
        passes: 2
      },
      mangle: {
        safari10: true
      },
      format: {
        comments: false
      }
    },
    rollupOptions: {
      output: {
        // Fine-grained manual chunks — each heavy library in its own lazy chunk
        manualChunks(id) {
          // React core — always needed, load first
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'vendor-react';
          }
          // Three.js — only loaded when WebGL background mounts (lazy)
          if (id.includes('node_modules/three')) {
            return 'vendor-three';
          }
          // GSAP — only loaded when HeroMotion or WebGL mounts (lazy)
          if (id.includes('node_modules/gsap')) {
            return 'vendor-gsap';
          }
          // Framer Motion — loaded with ProductCard, split out
          if (id.includes('node_modules/framer-motion')) {
            return 'vendor-motion';
          }
          // Lucide icons — tree-shaken but grouped for caching
          if (id.includes('node_modules/lucide-react')) {
            return 'vendor-icons';
          }
          // Supabase — network client, load lazily
          if (id.includes('node_modules/@supabase')) {
            return 'vendor-supabase';
          }
          // Heavy catalog data — its own chunk, loaded async
          if (id.includes('/src/lib/catalogData')) {
            return 'catalog-data';
          }
          // Admin dashboard — only loaded when authenticated admin navigates there
          if (id.includes('/src/admin/')) {
            return 'admin';
          }
        },
        // Content hash for long-lived cache headers
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  }
});
