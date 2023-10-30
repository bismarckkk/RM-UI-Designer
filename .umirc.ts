import { defineConfig } from "umi";

export default defineConfig({
  npmClient: 'pnpm',
  plugins: ['@umijs/plugins/dist/antd'],
  antd: {
    compact: true
  },
  title: 'RM UI Designer',
  history: {type: "hash"},
});
