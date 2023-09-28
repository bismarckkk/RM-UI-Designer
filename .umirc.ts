import { defineConfig } from "umi";

export default defineConfig({
  npmClient: 'pnpm',
  plugins: ['@umijs/plugins/dist/antd'],
  antd: {},
  base: '/RM-UI-Designer/',
  publicPath: '/RM-UI-Designer/'
});
