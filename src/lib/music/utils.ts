import { NeteaseSongItem } from "@/types/NeteaseTypes";
import { SongInfo } from "@/store/player";

/**
 * 将网易云的歌曲数据 (`NeteaseSongItem`) 转换为应用内部统一的 `SongInfo` 格式。
 *
 * @param neteaseSong 从网易云 API 获取的原始歌曲对象。
 * @returns {SongInfo} 转换后的、标准化的歌曲对象。
 */
export function transformNeteaseSong(neteaseSong: NeteaseSongItem): SongInfo {
  // 从 ar 或 artists 中提取歌手名，兼容搜索结果和歌曲详情
  const artists = (neteaseSong.ar || neteaseSong.artists || [])
    .map((artist) => artist.name)
    .join(" / ");

  // 从 al 或 album 中提取专辑信息
  const album = neteaseSong.al || neteaseSong.album;

  // 从 dt 或 duration 中提取时长（API提供的是毫秒，需转换为秒）
  const duration = (neteaseSong.dt || neteaseSong.duration || 0) / 1000;

  return {
    id: `netease-${neteaseSong.id}`,
    title: neteaseSong.name || "未知歌曲",
    artist: artists || "未知艺术家",
    album: album?.name || "未知专辑",
    cover: `${album?.picUrl}?param=130y130` || "",
    url: "",
    duration: duration,
    source: "netease",
    originalData: neteaseSong,
  };
}
