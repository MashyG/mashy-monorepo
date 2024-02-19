//plugins\devPlugin.ts
import { ViteDevServer } from "vite";
import Esbuild from "esbuild";
import ChildProcess from "child_process";
import Electron from "electron";

export const devPlugin = () => {
  return {
    name: "dev-plugin",
    configureServer(server: ViteDevServer) {
      Esbuild.buildSync({
        entryPoints: ["./src/plugins/index.ts"],
        bundle: true,
        platform: "node",
        outfile: "./dist/mainEntry.js",
        external: ["electron"],
      });
      server.httpServer.once("listening", () => {
        let { spawn } = ChildProcess || {};
        let addressInfo: any = server.httpServer.address();
        let httpAddress = `http://localhost:${addressInfo.port}`;
        // child_process 模块的 spawn 方法启动 electron 子进程的
        let electronProcess = spawn?.(
          Electron.toString(),
          ["./dist/mainEntry.js", httpAddress],
          {
            cwd: process.cwd(),
            stdio: "inherit",
          }
        );
        electronProcess.on("close", () => {
          server.close();
          process.exit();
        });
      });
    },
  };
};

// getReplacer 方法是我们为 vite-plugin-optimizer 插件提供的内置模块列表
export const getReplacer = () => {
  let externalModels = [
    "os",
    "fs",
    "path",
    "events",
    "child_process",
    "crypto",
    "http",
    "buffer",
    "url",
    "better-sqlite3",
    "knex",
  ];
  let result = {};
  for (let item of externalModels) {
    result[item] = () => ({
      find: new RegExp(`^${item}$`),
      code: `const ${item} = require('${item}');export { ${item} as default }`,
    });
  }
  result["electron"] = () => {
    let electronModules = [
      "clipboard",
      "ipcRenderer",
      "nativeImage",
      "shell",
      "webFrame",
    ].join(",");
    return {
      find: new RegExp(`^electron$`),
      code: `const {${electronModules}} = require('electron');export {${electronModules}}`,
    };
  };
  return result;
};
