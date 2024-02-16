import { defineConfig } from "umi";

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
  chainWebpack(memo) {
    const { GenerateSW } = require("workbox-webpack-plugin");
    memo.plugin('workbox').use(GenerateSW, [{
      cacheId: 'rmui-pwa',
      clientsClaim: true,
      skipWaiting: true,
      cleanupOutdatedCaches: true,
      swDest: 'sw.js'
    }])
  }
});
