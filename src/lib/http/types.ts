import { AxiosRequestConfig } from "axios";

export type Platform = "netease" | "kugou" | "bilibili";

export interface RequestConfig extends AxiosRequestConfig {
  platform?: Platform;
  showError?: boolean;
  showLoading?: boolean;
}
