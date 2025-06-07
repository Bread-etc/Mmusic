import { app, BrowserWindow, ipcMain, Tray, Menu, dialog, nativeImage } from "electron";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
import Store from "electron-store";

const store = new Store();

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

// 创建托盘
function createTray() {
  const icon = nativeImage.createFromPath(
    path.join(process.env.VITE_PUBLIC, "icon.png")
  );

  tray = new Tray(icon);
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '显示主界面',
      click: () => win?.show()
    },
    { type: 'separator' },
    {
      label: '退出',
      click: () => {
        isQuiting = true;
        app.quit();
      }
    },
  ]);

  tray.setToolTip('MMusic');
  tray.setContextMenu(contextMenu);

  tray.on('click', () => {
    win?.show();
  });
}

// 处理窗口关闭事件
async function handleWindowClose(event: Event) {
  if (!isQuiting) {
    event.preventDefault();
    const result = await dialog.showMessageBox(win!, {
      type: 'question',
      buttons: ['最小化到托盘', '直接退出'],
      title: '关闭确认',
      message: '确定要关闭程序吗？',
      detail: '您可以选择最小化到托盘或直接退出程序。',
      cancelId: 0,
    });

    if (result.response === 0) {
      win?.hide();
    } else {
      isQuiting = true;
      app.quit();
    }
  }
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
    backgroundColor: "rgba(0, 0, 0, 0)",
    icon: path.join(process.env.VITE_PUBLIC, "icon.png"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      nodeIntegration: false,
      contextIsolation: true,
    },
    vibrancy: "under-window", // macOS 上的毛玻璃效果
    visualEffectState: "active", // macOS 上的视觉效果
    // Windows 上的圆角设置
    roundedCorners: true,
  });

  // 处理窗口关闭事件
  win.on('close', async (event) => {
    if (!isQuiting) {
      event.preventDefault();

      const closeAction = store.get('closeAction');
      if (closeAction === undefined) {
        // 如果没有保存过偏好，显示对话框
        const { response, checkboxChecked } = await dialog.showMessageBox(win!, {
          type: 'question',
          buttons: ['最小化到托盘', '直接退出'],
          defaultId: 0,
          title: '关闭确认',
          message: '您要直接退出程序还是最小化到系统托盘？',
          checkboxLabel: '不再询问',
          checkboxChecked: false,
        });

        if (checkboxChecked) {
          // 保存用户选择
          store.set('closeAction', response === 0 ? 'minimize' : 'quit');
        }

        if (response === 0) {
          win?.hide();
        } else {
          isQuiting = true;
          app.quit();
        }
      } else {
        // 如果有保存的偏好，直接执行
        if (closeAction === 'minimize') {
          win?.hide();
        } else {
          isQuiting = true;
          app.quit();
        }
      }
    }
  });


  // Test active push message to Renderer-process.
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(() => {
  createWindow();
  createTray();
});

// 监听最小化事件
ipcMain.on("minimize-window", () => {
  win?.minimize();
});

// 监听关闭事件
ipcMain.on("close-window", () => {
  if (win) {
    handleWindowClose(new Event('close'));
  }
});