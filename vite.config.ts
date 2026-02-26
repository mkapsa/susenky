import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'CookieConsent',
      formats: ['iife'],
      fileName: () => 'consent.min.js',
    },
    outDir: 'dist',
    minify: 'terser',
    terserOptions: {
      compress: {
        passes: 2,
        drop_console: true,
      },
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },
});
