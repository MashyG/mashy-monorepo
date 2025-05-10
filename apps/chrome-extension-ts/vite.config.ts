import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import type { UserConfig } from "vite";
import { crx } from "@crxjs/vite-plugin";
import { getManifestConfig } from "./src/manifest";

export default defineConfig({
  plugins: [vue(), crx({ manifest: getManifestConfig() })],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  build: {
    outDir: "dis",
    cssCodeSplit: true,
  },
}) as UserConfig;
