import { defineConfig } from "umi";

export default defineConfig({
  npmClient: 'pnpm',
  plugins: ['@umijs/plugins/dist/antd'],
  antd: {},
  publicPath: '/RM-UI-Designer/',
  title: 'RM UI Designer',
  history: {type: "hash"},
});
