import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Override via `npm run build -- --base=/nama-repo/` for GitHub Pages project sites.
  base: '/',
  build: {
    target: 'es2020',
    sourcemap: false,
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three/')) return 'three';
          if (id.includes('node_modules/@firebase/auth') || id.includes('node_modules/firebase/auth')) return 'firebase-auth';
          if (id.includes('node_modules/@firebase/firestore') || id.includes('node_modules/firebase/firestore')) return 'firebase-firestore';
          if (id.includes('node_modules/@firebase/') || id.includes('node_modules/firebase/')) return 'firebase-core';
          if (id.includes('node_modules/react')) return 'react-vendor';
        },
      },
    },
  },
});
