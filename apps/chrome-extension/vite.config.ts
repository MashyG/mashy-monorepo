import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { crx } from "@crxjs/vite-plugin";
import { getManifestConfig } from "./manifest";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), crx({ manifest: getManifestConfig() })],
});
