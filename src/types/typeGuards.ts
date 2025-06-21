/* 类型守卫工具 */
import type { NeteaseSongItem, SearchResultForNetease } from "./NeteaseTypes";
import type { KugouSongItem, SearchResultForKugou } from "./KugouTypes";

export function isNeteaseResult(result: any): result is SearchResultForNetease {
  return (
    result &&
    Array.isArray(result.songs) &&
    typeof result.songCount === "number"
  );
}

export function isKugouResult(result: any): result is SearchResultForKugou {
  return (
    result &&
    typeof result.data === "object" &&
    Array.isArray(result.data.lists) &&
    typeof result.data.total === "number"
  );
}

// 判断是否为网易云歌曲项
export function isNeteaseSongItem(song: any): song is NeteaseSongItem {
  return (
    song &&
    Array.isArray(song.artists) &&
    typeof song.name === "string" &&
    song.hasOwnProperty("duration")
  );
}

// 判断是否为酷狗歌曲项
export function isKugouSongItem(song: any): song is KugouSongItem {
  return (
    song &&
    typeof song.FileHash === "string" &&
    typeof song.SongName === "string"
  );
}