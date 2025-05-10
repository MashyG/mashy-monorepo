import * as fs from "node:fs";
import * as path from "node:path";

import type { ManifestV3Export } from "@crxjs/vite-plugin";
import type { PluginOption } from "vite";

const { resolve } = path;

const outDir = resolve(__dirname, "..", "..", "public");

export const getManifestConfig = (): ManifestV3Export => {
  return {
    manifest_version: 3,
    name: "Vue Chrome Extension",
    version: "1.0",
    description: "使用 Vue3 + TS + Vite 构建的 Chrome 扩展",
    permissions: [
      "webRequest",
      "declarativeNetRequest",
      "declarativeNetRequestWithHostAccess",
      "declarativeNetRequestFeedback",
      "scripting",
      "notifications",
      "background",
      "tabs",
      "unlimitedStorage",
      "storage",
      "contextMenus",
      "webNavigation",
      "cookies",
      "offscreen",
    ],
    web_accessible_resources: [
      {
        resources: ["assets/*"],
        matches: ["<all_urls>"],
      },
    ],
    action: {
      default_popup: "popup/index.html",
    },
    background: {
      service_worker: "background/index.ts",
    },
    content_scripts: [
      {
        js: ["content/index.ts"],
        matches: ["<all_urls>"],
        run_at: "document_end",
        all_frames: true,
      },
    ],
  };
};

export default function makeManifest(): PluginOption {
  return {
    name: "make-manifest",
    enforce: "pre",
    async config() {
      console.log(outDir, "outDir :)");
      if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir);
      }

      const manifestPath = resolve(outDir, "manifest.json");

      await fs.writeFileSync(manifestPath, JSON.stringify(getManifestConfig()));

      console.log(`Manifest file copy complete: ${manifestPath}`, "success");
    },
  };
}
