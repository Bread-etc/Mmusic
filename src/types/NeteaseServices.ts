/*  ===== 搜索 ===== */
interface NeteaseArtists {
  albumSize: number;
  alias: Array<any>;
  fansGroup: any;
  id: number;
  img1v1: number;
  img1v1Url: string;
  name: string; // 歌手姓名
  picId: number;
  picUrl: number;
  trans: any;
}

interface NeteaseSongs {
  album: Array<any>;
  alias: Array<any>;
  artists: Array<NeteaseArtists>;
  copyrightId: number;
  duration: number; // 歌曲时长
  fee: number;
  ftype: number;
  id: number;
  mark: number;
  mvid: number;
  name: string; // 歌名
  rUrl: null;
  rtype: number;
  status: number;
}

export interface SearchResultForNetease {   // 为res.data.result下的类型
  hasMore: boolean;
  songCount: number;
  songs: Array<NeteaseSongs>;
}
