import { ipcMain } from "electron";
import axios, { AxiosRequestConfig } from "axios";
import Store from "electron-store";

const baseUrls = {
  netease: "http://netease.hastur23.top",
  kugou: "http://kugou.hastur23.top",
  // bilibili: "https://api.bilibili.com",
} as const;

type Platform = keyof typeof baseUrls;
const store = new Store();

// 统一处理请求
ipcMain.handle(
  "http:request",
  async (_event, config: AxiosRequestConfig & { platform?: Platform }) => {
    if (config.platform) {
      const cookie = store.get(`cookies.${config.platform}`);
      if (cookie) {
        config.headers = { ...config.headers, Cookie: cookie as string };
      }
      config.baseURL = baseUrls[config.platform];
    }
    try {
      const res = await axios(config);
      return { success: true, data: res.data, status: res.status };
    } catch (err: any) {
      return {
        success: false,
        message: err.message,
        status: err.response?.status ?? 500,
        data: err.response?.data,
      };
    }
  }
);

// 提供设置、获取 cookie 的接口
ipcMain.handle(
  "http:setCookie",
  (_event, platform: Platform, cookie: string) => {
    store.set(`cookies.${platform}`, cookie);
    return true;
  }
);
ipcMain.handle("http:getCookie", (_event, platform: Platform) => {
  return store.get(`cookies.${platform}`) || "";
});
