import { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage } from "electron";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
import Store from "electron-store";
import "./request";

const store = new Store();

/* @ts-ignore */
const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, "..");

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

let win: BrowserWindow | null;
let tray: Tray | null;
let isQuiting = false;

// 创建托盘函数
function createTray() {
  const icon = nativeImage.createFromPath(
    path.join(process.env.VITE_PUBLIC, "icon.png")
  );
  tray = new Tray(icon);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "显示主界面",
      click: () => win?.show(),
    },
    { type: "separator" },
    {
      label: "退出",
      click: () => {
        isQuiting = true;
        app.quit();
      },
    },
  ]);

  tray.setToolTip("Mmusic");
  tray.setContextMenu(contextMenu);

  tray.on("click", () => {
    win?.show();
  });
}

function createWindow() {
  win = new BrowserWindow({
    width: 1000,
    height: 670,
    minWidth: 800,
    minHeight: 600,
    maxWidth: 1000,
    maxHeight: 670,
    resizable: true,
    frame: false,
    transparent: true,
    backgroundColor: "#00000000",
    title: "Mmusic",
    icon: path.join(process.env.VITE_PUBLIC, "icon.png"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      nodeIntegration: true,
      contextIsolation: true,
      webSecurity: true,
      enableWebSQL: false,
      spellcheck: false,
    },
  });

  // 处理窗口关闭事件
  win.on("close", (event) => {
    if (isQuiting) return;
    event.preventDefault();

    const closeAction = store.get("closeAction");

    if (closeAction === "minimize") {
      win?.hide();
    } else if (closeAction === "exit") {
      isQuiting = true;
      app.quit();
    } else {
      // 用户没有选择记忆事件
      win?.webContents.send("open-close-confirm-dialog");
    }
  });

  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(() => {
  createWindow();
  createTray();
});

/* ======================================================= */
/* ipcMain处理函数 */
/* ======================================================= */

ipcMain.on("minimize-window", () => {
  win?.minimize();
});

ipcMain.on("close-window", () => {
  win?.close();
});

ipcMain.on("close-dialog-response", (_event, { action, remember }) => {
  if (remember) {
    store.set("closeAction", action);
  }

  if (action === "minimize") {
    win?.hide();
  } else {
    isQuiting = true;
    app.quit();
  }
});

ipcMain.handle("getStore", (_event, key) => {
  return store.get(key);
});

ipcMain.handle("setStore", (_event, key, value) => {
  store.set(key, value);
});

ipcMain.handle("deleteStore", (_event, key) => {
  store.delete(key);
});

ipcMain.handle("hasStore", (_event, key) => {
  return store.has(key);
});

ipcMain.handle("clearStore", () => {
  store.clear();
});
