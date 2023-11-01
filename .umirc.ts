import { defineConfig } from "umi";
import enUS from 'antd/locale/en_US';

export default defineConfig({
  npmClient: 'pnpm',
  plugins: ['@umijs/plugins/dist/antd'],
  antd: {
    configProvider:{
      locale: enUS
    }
  },
  title: 'RM UI Designer',
  history: {type: "hash"},
});
