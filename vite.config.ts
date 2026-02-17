import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const gitRef = process.env.ref;

const tauriConf = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, 'src-tauri/tauri.conf.json'), 'utf-8'),
);

let version = `v${tauriConf.package.version}`;
if (process.env.NODE_ENV === 'development') {
  version = 'development';
}
if (gitRef) {
  version = `nightly ${gitRef.slice(0, 7)}`;
}

export default defineConfig({
  base: gitRef ? '/nightly/' : '/',
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
    ...(!gitRef
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
