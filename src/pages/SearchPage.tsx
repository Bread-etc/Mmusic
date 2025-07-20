import { useEffect, useState } from "react";
import { toast } from "sonner";

import { searchNetease } from "@/lib/music/neteaseService";
import { NeteaseSongItem } from "@/types/NeteaseTypes";
import { SongCard } from "@/components/layout/MainContent/SongCard";

import "react-virtualized/styles.css";
import { AutoSizer, List, ListRowProps } from "react-virtualized";
import { useLoaderData } from "react-router-dom";

interface SearchLoaderResult {
  songs: NeteaseSongItem[];
  hasMore: boolean;
  keyword: string;
}

export function SeachPage() {
  const initalData = useLoaderData() as SearchLoaderResult;
  const [songs, setSongs] = useState(initalData.songs || []);
  const [hasMore, setHasMore] = useState(initalData.hasMore || false);
  const [isPaging, setIsPaging] = useState(false);

  // 同步初始数据
  useEffect(() => {
    setSongs(initalData.songs || []);
    setHasMore(initalData.hasMore || false);
  }, [initalData]);

  // 加载更多歌曲
  const loadMoreRows = async () => {
    if (isPaging || !hasMore || !initalData.keyword) return;

    setIsPaging(true);

    try {
      const offset = songs.length;
      const res = await searchNetease(initalData.keyword, offset);
      const result = res.data.result;
      setSongs((prevSongs) => [...prevSongs, ...(result.songs || [])]);
      setHasMore(result.hasMore ?? false);
    } catch (err) {
      toast.error("加载更多失败");
    } finally {
      setIsPaging(false);
    }
  };

  // 渲染虚拟列表中的每一行
  const rowRenderer = ({ index, key, style }: ListRowProps) => {
    const song = songs[index];
    return (
      <div key={key} style={style}>
        <SongCard index={index} song={song} />
      </div>
    );
  };

  // 根据不同状态显示不同内容
  const renderContent = () => {
    if (!songs || songs.length === 0) {
      // 没有关键词,默认初始界面
      return (
        <div className="flex-center h-full">
          <span className="text-title-small mb-16 tracking-[.1rem]">
            没有找到关于 "{initalData.keyword}"的歌曲
          </span>
        </div>
      );
    }

    return (
      <AutoSizer>
        {({ width, height }) => (
          <List
            width={width}
            height={height}
            rowCount={songs.length}
            rowHeight={60}
            rowRenderer={rowRenderer}
            onRowsRendered={({ stopIndex }) => {
              if (hasMore && stopIndex >= songs.length - 5) {
                loadMoreRows();
              }
            }}
            overscanRowCount={5}
          />
        )}
      </AutoSizer>
    );
  };

  return <div className="h-full min-h-0">{renderContent()}</div>;
}
