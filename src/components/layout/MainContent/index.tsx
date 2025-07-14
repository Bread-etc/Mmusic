import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";

import { useSearchResultStore } from "@/store/searchResult";
import { searchNetease } from "@/lib/music/neteaseService";
import { NeteaseSongItem } from "@/types/NeteaseTypes";
import { SongCard } from "./SongCard";

import "react-virtualized/styles.css";
import { AutoSizer, List, ListRowProps } from "react-virtualized";

export function MainContent() {
  const { keyword } = useSearchResultStore();

  const [songs, setSongs] = useState<NeteaseSongItem[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 使用useRef来确保在异步加载中总能拿到最新的keyword和loading状态
  const keywordRef = useRef(keyword);
  keywordRef.current = keyword;
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
        // 检查搜索结果是否仍然对应当前关键词，防止异步请求覆盖
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

  // 渲染虚拟列表中的每一行
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
    if (keyword) {
      if (isLoading && songs.length === 0) {
        // 骨架屏加载状态
        return (
          <div className="p-2 space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-lg">
                <div className="w-10 h-10 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="w-3/4 h-4 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse"></div>
                  <div className="w-1/2 h-3 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        );
      }
      if (error) {
        return (
          <div className="flex-center h-full">
            <span className="text-title-small mb-16 tracking-[.1rem]">
              {error}
            </span>
          </div>
        );
      }
      if (songs.length > 0) {
        return (
          <AutoSizer>
            {({ width, height }) => (
              <List
                width={width}
                height={height}
                rowCount={songs.length}
                rowHeight={56}
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
      // 如果没有歌曲且没有错误，可能是因为没搜到，显示错误信息
      if (error)
        return (
          <div className="flex-center h-full">
            <span className="text-title-small mb-16 tracking-[.1rem]">
              {error}
            </span>
          </div>
        );
    }

    // 默认初始界面
    return (
      <main className="flex-center h-full">
        <span className="text-title-small mb-16 tracking-[.1rem]">
          搜索你喜欢的音乐
        </span>
      </main>
    );
  };

  return <main className="flex-grow w-full min-h-0">{renderContent()}</main>;
}
