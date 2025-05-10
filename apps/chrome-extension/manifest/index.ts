import type { ManifestV3Export } from "@crxjs/vite-plugin";

export const getManifestConfig = (): ManifestV3Export => {
  return {
    manifest_version: 3,
    name: "clickTagAudio",
    icons: {
      16: "icon/audio.png",
      128: "icon/audio.png",
    },
    version: "1.0.0",
    action: { default_popup: "src/popup/index.html" },
    content_scripts: [
      {
        js: ["src/content/index.tsx"],
        run_at: "document_end",
        matches: ["<all_urls>"],
      },
    ],
    background: {
      service_worker: "src/background/index.ts",
    },
  };
};
