import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

import { devPlugin } from "./src/plugins/devPlugin";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [devPlugin(), vue()],
});
