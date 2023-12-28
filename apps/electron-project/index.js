const { app, BrowserWindow } = require("electron");

const createWindow = () => {
  // 创建浏览器窗口
  const win = new BrowserWindow({
    width: 800,
    height: 600,
  });
  // 加载 index.html 文件
  win.loadFile("index.html");
};

// 在 Electron 中，只有在 app 模块的 ready 事件被激发后才能创建浏览器窗口
app.whenReady().then(() => {
  createWindow();
  // 当 Linux 和 Windows 应用在没有窗口打开时退出了，macOS 应用通常即使在没有打开任何窗口的情况下也继续运行，并且在没有窗口可用的情况下激活应用时会打开新的窗口。
  app.on("activate", () => {
    // 如果没有任何浏览器窗口是打开的，则调用 createWindow() 方法。
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// 关闭所有窗口时退出应用
app.on("window-all-closed", () => {
  // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，否则应用与菜单栏始终处于活动状态。
  if (process.platform !== "darwin") app.quit();
});
