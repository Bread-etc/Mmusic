import { useEffect, useState, useRef } from "react";
import { AutoSizer, List, ListRowProps } from "react-virtualized";
import { toast } from "sonner";

import { useSearchResultStore } from "@/store/searchResult";
import { searchNetease } from "@/lib/music/neteaseService";
import { NeteaseSongItem } from "@/types/NeteaseTypes";
import { SongCard } from "./SongCard";

import "react-virtualized/styles.css"; // 引入虚拟列表样式

function MainContent() {
  const { keyword } = useSearchResultStore();
  const [songs, setSongs] = useState<NeteaseSongItem[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 使用 useRef 来确保在异步加载中总能拿到最新的 keyword
  const keywordRef = useRef(keyword);
  keywordRef.current = keyword;

  // 使用 useRef 来避免重复加载
  const isLoadingRef = useRef(false);

  // 当关键词变化时，重置所有状态并进行首次搜索
  useEffect(() => {
    const performSearch = async () => {
      if (!keyword) {
        setSongs([]);
        setHasMore(true);
        setError(null);
        return;
      }

      setIsLoading(true);
      isLoadingRef.current = true;
      setError(null);

      try {
        const res = await searchNetease(keyword, 0);
        // 检查搜索结果是否仍然对应当前关键词
        if (keywordRef.current === keyword) {
          const result = res.data.result;
          setSongs(result.songs || []);
          setHasMore(result.hasMore ?? false);
          if (!result.songs || result.songs.length === 0) {
            setError("没有找到相关的歌曲");
          }
        }
      } catch (err) {
        toast.error("搜索失败，请检查网络连接");
        setError("搜索出错了");
      } finally {
        setIsLoading(false);
        isLoadingRef.current = false;
      }
    };

    performSearch();
  }, [keyword]);

  // 加载更多歌曲
  const loadMoreRows = async () => {
    if (isLoadingRef.current || !hasMore || !keyword) return;

    isLoadingRef.current = true;

    try {
      const offset = songs.length;
      const res = await searchNetease(keyword, offset);
      const result = res.data.result;
      setSongs((prevSongs) => [...prevSongs, ...(result.songs || [])]);
      setHasMore(result.hasMore ?? false);
    } catch (err) {
      toast.error("加载更多失败");
    } finally {
      isLoadingRef.current = false;
    }
  };

  // 渲染列表中的每一行
  const rowRenderer = ({ index, key, style }: ListRowProps) => {
    const song = songs[index];
    return (
      <div key={key} style={style} className="app-region-no-drag px-2">
        <SongCard index={index} song={song} />
      </div>
    );
  };

  // 根据不同状态显示不同内容
  const renderContent = () => {
    if (isLoading && songs.length === 0) {
      return <div className="flex-center h-full title-small opacity-50">正在努力搜索...</div>;
    }
    if (error) {
      return <div className="flex-center h-full title-small opacity-50">{error}</div>;
    }
    if (!keyword) {
      return <div className="flex-center h-full title-small opacity-50">搜索你喜欢的音乐</div>;
    }
    if (songs.length > 0) {
      return (
        <AutoSizer>
          {({ width, height }) => (
            <List
              width={width}
              height={height}
              rowCount={songs.length}
              rowHeight={64} // 固定行高，提升性能
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
    }
    return null; // 默认不显示任何内容
  };

  return <div className="flex-grow w-full pt-2 min-h-0">{renderContent()}</div>;
}

export default MainContent;