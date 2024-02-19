import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

import { devPlugin, getReplacer } from "./src/plugins/devPlugin";
import optimizer from "vite-plugin-optimizer"; // 引入vite-plugin-optimizer插件 用于优化打包

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [optimizer(getReplacer()), devPlugin(), vue()],
});
