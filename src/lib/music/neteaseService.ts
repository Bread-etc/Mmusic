import { NeteaseSongQuality } from "@/types/NeteaseTypes";
import { httpRequest } from "../http/request";

/**
 * 二维码 key 生成接口
 */
export function generateKey() {
  return httpRequest({
    url: "/login/qr/key",
    method: "GET",
    params: {},
    platform: "netease",
    showLoading: true,
    showError: true,
  });
}

/**
 * 二维码生成接口
 * @param key uni-key
 */
export function generateQrCode(uniKey: string) {
  return httpRequest({
    url: "/login/qr/create",
    method: "GET",
    platform: "netease",
    params: { key: uniKey },
    showLoading: true,
    showError: true,
  });
}

/**
 * 二维码检测接口
 * @param key uni-key
 */
export function qrCodeCheck(uniKey: string) {
  return httpRequest({
    url: "/login/qr/check",
    method: "GET",
    params: { key: uniKey },
    platform: "netease",
    showLoading: false,
    showError: false,
  });
}

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

/**
 * 获取指定音乐详情
 * @param ids 指定音乐id或多个id
 */
export function songDetailNetease(ids: string) {
  return httpRequest({
    url: "/song/detail",
    method: "GET",
    params: { ids: ids },
    platform: "netease",
    showLoading: true,
    showError: true,
  });
}

/**
 * 获取音乐URL - 新版
 * @param id 指定音乐 ID
 * @param level 音乐质量
 */
export function songUrlNetease(id: string, quality: NeteaseSongQuality) {
  return httpRequest({
    url: "/song/url/v1",
    method: "GET",
    params: { id: id, level: quality },
    platform: "netease",
    showLoading: true,
    showError: true,
  });
}
