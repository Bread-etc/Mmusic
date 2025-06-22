import { httpRequest } from "../http/request";

/**
 * 搜索歌曲
 * @param keywords 搜索关键词
 * @param offset 分页偏移量
 * @param limit 每页数量，默认为 30
 * @param type 搜索类型，默认为 1 只搜索单曲
 */
export function searchNetease(
  keywords: string,
  offset: number,
  limit: number = 30,
  type: number = 1
) {
  return httpRequest({
    url: "/search",
    method: "GET",
    params: { keywords: keywords, offset: offset, limit: limit, type: type },
    platform: "netease",
    showLoading: true,
    showError: true,
  });
}
