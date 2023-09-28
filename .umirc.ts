import { defineConfig } from "umi";

export default defineConfig({
  npmClient: 'yarn',
  plugins: ['@umijs/plugins/dist/antd'],
  antd: {},
  base: '/RM-UI-Designer/'
});
