import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react';
import critical from 'rollup-plugin-critical';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    critical({
      criticalUrl: './build/index.html',
      criticalBase: './build',
      criticalPages: [
        {
          uri: '',
          template: 'index',
        },
      ],
      criticalConfig: {
        inline: true,
        extract: false,
      },
    }),
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
        manualChunks: {
          // Keep React ecosystem together
          'react-vendor': ['react', 'react-dom'],
          
          // Firebase libraries
          'firebase-vendor': ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage'],
          
          // MUI libraries
          'mui-vendor': ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
          
          // Other utilities
          'utils-vendor': ['framer-motion', 'react-lazyload', '@hello-pangea/dnd']
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
