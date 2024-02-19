import { app, BrowserWindow } from "electron";

//  用于设置渲染进程开发者调试工具的警告，这里设置为 true 就不会再显示任何警告了
// 如果渲染进程的代码可以访问 Node.js 的内置模块，而且渲染进程加载的页面（或脚本）是第三方开发的，
// 那么恶意第三方就有可能使用 Node.js 的内置模块伤害最终用户
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "true";

let mainWindow: BrowserWindow;

app.whenReady().then(() => {
  let config = {
    webPreferences: {
      nodeIntegration: true, // 是否集成 Nodejs
      webSecurity: false, // 是否禁用安全策略
      allowRunningInsecureContent: true, // 是否允许运行不安全内容
      contextIsolation: false, // 是否隔离上下文 (建议开启)
      webviewTag: true, // 是否启用 <webview> 标签
      spellcheck: false, // 是否启用拼写检查
      disableHtmlFullscreenWindowResize: true, // 是否禁用 HTML 全屏窗口调整大小
    },
  };
  mainWindow = new BrowserWindow(config);
  // mainWindow.webContents.openDevTools({ mode: "undocked" }); // 开启调试工具
  mainWindow.loadURL(process.argv[2]);
});
