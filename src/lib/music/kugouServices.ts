import { httpRequest } from "../http/request";

/* 搜索歌曲 */
export function searchKugou(keyword: string) {
  return httpRequest({
    url: "/search",
    method: "GET",
    params: { keywords: keyword, type: "song" },
    platform: "kugou",
    showLoading: true,
    showError: true,
  });
}
