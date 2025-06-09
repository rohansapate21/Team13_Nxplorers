import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  css: {
    modules: false, // Disable CSS modules if not needed
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./src/styles/variables.scss";` // If using SCSS
      }
    }
  },
  build: {
    assetsInlineLimit: 0, // Ensure CSS files are not inlined
  }
});2 