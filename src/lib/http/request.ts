import { toast } from "sonner";
import { useLoadingStore } from "@/store/loading";
import type { RequestConfig } from "./types";

const { setLoading } = useLoadingStore.getState();

export async function httpRequest<T = any>(config: RequestConfig): Promise<T> {
  if (config.showLoading) setLoading(true);
  try {
    const res = await window.http.request(config);
    if (!res.success && config.showError !== false) {
      toast.error(res.message || "请求失败");
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
