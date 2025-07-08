// =================================================================================
// N E T E A S E   A P I   T Y P E S
// =================================================================================

/** 歌手的基础信息结构 */
export interface NeteaseArtistBase {
  id: number;
  name: string;
  alias?: string[];
  [key: string]: any;
}

/** 专辑的基础信息结构 */
export interface NeteaseAlbumBase {
  id: number;
  name: string;
  picUrl: string;
  artist?: NeteaseArtistBase;
  [key: string]: any;
}

/**
 * 网易云歌曲项目的核心类型定义。
 * @description 这个接口被设计为可兼容多种API返回的歌曲结构：
 * - **来自搜索结果**: 通常包含 `ar`, `al`, `dt` 字段。
 * - **来自歌曲详情**: 通常包含 `artists`, `album`, `duration` 字段。
 * 通过将所有可能字段都定义为可选，可以灵活地处理不同来源的数据。
 */
export interface NeteaseSongItem {
  id: number;
  name: string;

  // --- 歌手信息 ---
  /** 歌手列表 (主要来自搜索结果) */
  ar?: NeteaseArtistBase[];
  /** 详细歌手信息 (主要来自歌曲详情) */
  artists?: NeteaseArtistBase[];

  // --- 专辑信息 ---
  /** 专辑信息 (主要来自搜索结果) */
  al?: NeteaseAlbumBase;
  /** 详细专辑信息 (主要来自歌曲详情) */
  album?: NeteaseAlbumBase;

  // --- 时长信息 ---
  /** 歌曲时长 (毫秒, 主要来自搜索结果) */
  dt?: number;
  /** 歌曲时长 (毫秒, 主要来自歌曲详情) */
  duration?: number;

  // --- 其他常见属性 ---
  alia?: string[]; // 歌曲别名
  fee?: number; // 费用相关
  mvid?: number; // MV ID
  [key: string]: any; // 使用索引签名来容错，允许其他未显式定义的属性
}

/** 搜索结果的类型 */
export interface NeteaseSearchResult {
  hasMore?: boolean;
  songCount: number;
  songs: NeteaseSongItem[];
}

/** 歌曲 URL 信息 */
export interface NeteaseSongUrlInfo {
  id: number;
  url: string;
  br: number; // 码率
  size: number;
  level: string;
  encodeType: string;
}

/** 支持的音质类型 */
export type NeteaseSongQuality =
  | "standard" // 标准
  | "higher" // 较高
  | "exhigh" // 极高
  | "lossless" // 无损
  | "hires" // Hi-Res
  | "jyeffect" // 鲸云臻音
  | "sky" // 鲸云母带
  | "jymaster"; // 鲸云母带Pro
