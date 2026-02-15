import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import fs from 'node:fs';
import path from 'node:path';

const tauriConf = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, 'src-tauri/tauri.conf.json'), 'utf-8'),
);

let version = `v${tauriConf.package.version}`;
if (process.env.NODE_ENV === 'development') {
  version = 'development';
}
if (process.env.ref) {
  version = `nightly ${process.env.ref.slice(0, 7)}`;
}

export default defineConfig({
  base: process.env.ref ? '/nightly/' : '/',
  server: {
    port: 8000,
    strictPort: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  define: {
    'process.env.VERSION': JSON.stringify(version),
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  },
  plugins: [
    react(),
    ...(!process.env.ref
      ? [
          VitePWA({
            strategies: 'generateSW',
            filename: 'sw.js',
            injectRegister: false,
            workbox: {
              cleanupOutdatedCaches: true,
              clientsClaim: true,
              skipWaiting: true,
              cacheId: 'rmui-pwa',
              maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
              globIgnores: ['nightly/**', 'manifest*.json'],
            },
          }),
        ]
      : []),
  ],
});
