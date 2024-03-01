import { defineConfig } from "umi";

import fs from 'fs';
import path from 'path';

const tauriConf = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'src-tauri/tauri.conf.json'), 'utf-8'));
const version = `v${tauriConf.package.version}`;

export default defineConfig({
  npmClient: 'yarn',
  plugins: ['@umijs/plugins/dist/antd'],
  antd: {},
  title: 'RM UI Designer',
  history: {type: "hash"},
  links: [{
    href: '/manifest.json',
    rel: 'manifest'
  }],
  chainWebpack(memo, { webpack } ) {
    const { GenerateSW } = require("workbox-webpack-plugin");
    memo.plugin('workbox').use(GenerateSW, [{
      cacheId: 'rmui-pwa',
      clientsClaim: true,
      skipWaiting: true,
      cleanupOutdatedCaches: true,
      swDest: 'sw.js'
    }])
    memo.plugin('DefinePlugin').use(webpack.DefinePlugin, [{
      'process.env.VERSION': JSON.stringify(version),
    }])
  }
});
