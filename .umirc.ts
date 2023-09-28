import { defineConfig } from "umi";

export default defineConfig({
  npmClient: 'pnpm',
  plugins: ['@umijs/plugins/dist/antd'],
  antd: {},
  title: 'RM UI Designer',
  history: {type: "hash"},
});
