import { defineConfig } from "umi";

export default defineConfig({
  npmClient: 'pnpm',
  plugins: ['@umijs/plugins/dist/antd'],
  antd: {
    configProvider:{}
  },
  title: 'RM UI Designer',
  history: {type: "hash"},
});
