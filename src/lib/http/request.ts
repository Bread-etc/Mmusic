import { toast } from "sonner";
import { useLoadingStore } from "@/store/loading";
import type { RequestConfig } from "./types";

const { setLoading } = useLoadingStore.getState();

export async function httpRequest<T = any>(config: RequestConfig): Promise<T> {
  if (config.showLoading) setLoading(true);

  // 如果是网易云音乐的请求，自动附加cookie
  if (config.platform === "netease") {
    const cookie = await window.http.getCookie("netease");
    if (cookie) {
      config.params = { ...config.params, cookie };
    }
  }

  try {
    const res = await window.http.request(config);
    if (!res.success && config.showError !== false) {
      toast.error("请求失败，请检查网络连接！");
    }
    return res;
  } catch (error: any) {
    if (config.showError !== false) {
      toast.error(error.message || "网络错误");
    }
    throw error;
  } finally {
    if (config.showLoading) setLoading(false);
  }
}

// 设置、获取cookie
export function setPlatformCookie(platform: string, cookie: string) {
  return window.http.setCookie(platform, cookie);
}

export function getPlatformCookie(platform: string) {
  return window.http.getCookie(platform);
}
