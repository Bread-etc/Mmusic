/* ===== 搜索 ===== */
interface KugouSongItem {
  PublishTime: string;
  Audioid: number;
  OldCpy: number;
  PublishAge: number;
  bitflag: number;
  PayType: number;
  TagContent: string;
  Accompany: number;
  SingerName: string; // 歌手姓名
  ShowingFlag: number;
  Source: string;
  SQ: {
    FileSize: number;
    Hash: string; // 哈希值
    Privilege: number;
  };
  AlbumAux: string;
  Image: string;
  HQ: {
    FileSize: number;
    Hash: string;
    Privilege: number;
  };
  mvdata: Array<{
    typ: number;
    trk: string;
    hash: string; // 哈希值
    id: string;
  }>;
  M4aSize: number;
  HeatLevel: number;
  trans_param: {
    identity_block: number;
    ogg_128_hash: string; // 哈希值
    classmap: {
      attr0: number;
    };
    language: string;
    cpy_attr0: number;
    musicpack_advance: number;
    display: number;
    display_rate: number;
    union_cover: string;
    qualitymap: {
      attr0: number;
      attr1: number;
    };
    ogg_320_filesize: number;
    ogg_320_hash: string; // 哈希值
    cid: number;
    ogg_128_filesize: number;
    cpy_grade: number;
    ipmap: {
      attr0: number;
    };
    appid_block: string;
    hash_multitrack: string; // 哈希值
    pay_block_tpl: number;
    cpy_level: number;
  };
  UploaderContent: string;
  FileSize: number;
  IsOriginal: number;
  FileHash: string; // 哈希值
  FoldType: number;
  Grp: Array<any>;
  isPrepublish: number;
  Type: string;
  Bitrate: number;
  Auxiliary: string;
  ExtName: string;
  AlbumPrivilege: number;
  AlbumID: string;
  AlbumName: string;
  OtherName: string;
  Res: {
    FileSize: number;
    Privilege: number;
    Hash: string; // 哈希值
    BitRate: number;
    TimeLength: number;
  };
  SourceID: number;
  MixSongID: string;
  Suffix: string;
  Singers: [
    {
      name: string;
      ip_id: number;
      id: number;
    },
  ];
  MatchFlag: number;
  Scid: number;
  OriSongName: string;
  FailProcess: number;
  PublishDate: string;
  RankId: number;
  TagDetails: [
    {
      content: string;
      rankid: number;
      version: number;
      type: number;
    },
  ];
  PrepublishInfo: {
    ReserveCount: number;
    DisplayTime: string;
    Id: number;
    PublishTime: string;
  };
  OwnerCount: number;
  Uploader: string;
  Duration: number;
  TopID: number;
  FileName: string;
  recommend_type: number;
}

export interface SearchResultForKugou {
  error_msg: string;
  data: {
    correctiontip: string;
    pagesize: number;
    page: number;
    correctiontype: number;
    correctionrelate: string;
    total: number;
    lists: Array<KugouSongItem>;
  };
  status: number;
  error_code: number;
}
