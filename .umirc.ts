import { defineConfig } from "umi";

export default defineConfig({
  routes: [
    { path: "/", component: "index" },
    { path: "/docs", component: "docs" },
  ],
  npmClient: 'yarn',
  plugins: ['@umijs/plugins/dist/antd'],
  antd: {},
});
