import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'build',
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        // Only the libraries every page renders with get fixed chunks.
        // Firebase (lazy-loaded after first paint), framer-motion and the
        // admin-only drag-and-drop are left to Rollup, so a dynamic import
        // stays dynamic instead of being pulled into the first load.
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'mui-vendor': ['@mui/material', '@emotion/react', '@emotion/styled'],
        },
        // Add cache-friendly file naming
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    // Enable tree shaking
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug']
      }
    }
  },
  esbuild: {
    loader: "jsx",
    include: /src\/.*\.[jt]sx?$/,
    exclude: []
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".js": "jsx",
      },
    },
  },
  resolve: {
    alias: {
      'react': 'react',
      'react-dom': 'react-dom'
    },
    dedupe: ['react', 'react-dom']
  }
})
