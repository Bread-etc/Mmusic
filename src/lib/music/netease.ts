import { httpRequest } from "../http/request";

/* 搜索歌曲 */
export function searchNetease(keyword: string) {
  return httpRequest({
    url: "/search",
    method: "GET",
    params: { keywords: keyword },
    platform: "netease",
    showLoading: true,
    showError: true,
  });
}
