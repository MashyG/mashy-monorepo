//plugins\devPlugin.ts
import { ViteDevServer } from "vite";
import Esbuild from "esbuild";
import ChildProcess from "child_process";
import Electron from "electron";

export let devPlugin = () => {
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
      server.httpServer?.once("listening", () => {
        let { spawn } = ChildProcess;
        let addressInfo: any = server.httpServer?.address();
        console.log("addressInfo", addressInfo);
        let httpAddress = `http://localhost:${addressInfo.port}`;
        let electronProcess = spawn(
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
