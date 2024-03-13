import { defineConfig } from "umi";

import fs from 'fs';
import path from 'path';
import {GenerateSW} from "workbox-webpack-plugin";

const tauriConf = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'src-tauri/tauri.conf.json'), 'utf-8'));
let version = `v${tauriConf.package.version}`;
if (process.env.NODE_ENV === 'development') {
  version = 'development';
}
if (process.env.ref) {
  version = `nightly ${process.env.ref.slice(0, 7)}`;
}

export default defineConfig({
  npmClient: 'yarn',
  plugins: ['@umijs/plugins/dist/antd'],
  antd: {},
  publicPath: process.env.ref ? '/nightly/': '/',
  title: 'RM UI Designer',
  history: {type: "hash"},
  links: process.env.ref ? [] : [{
    href: '/manifest.json',
    rel: 'manifest'
  }],
  chainWebpack(memo, { webpack } ) {
    if (!process.env.ref) {
      const { GenerateSW } = require("workbox-webpack-plugin");
      memo.plugin('workbox').use(GenerateSW, [{
        cacheId: 'rmui-pwa',
        clientsClaim: true,
        skipWaiting: true,
        cleanupOutdatedCaches: true,
        swDest: 'sw.js'
      }])
    }
    memo.plugin('DefinePlugin').use(webpack.DefinePlugin, [{
      'process.env.VERSION': JSON.stringify(version),
    }])
  }
});
