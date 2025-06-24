import { useEffect, useRef, useState } from "react";
import { useSearchResultStore } from "@/store/searchResult";
import SongCard from "./SongCard";
import { AutoSizer, List } from "react-virtualized";
import "react-virtualized/styles.css";
import { NeteaseSongItem } from "@/types/NeteaseTypes";
import { searchNetease } from "@/lib/music/neteaseService";

function MainContent() {
  const { keyword } = useSearchResultStore();
  const [songs, setSongs] = useState<NeteaseSongItem[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const totalCount = useRef(0);
  const listRef = useRef<any>(null);

  // 关键词变化时，重置分页和数据
  useEffect(() => {
    if (!keyword) {
      setSongs([]);
      setPage(0);
      setHasMore(true);
      totalCount.current = 0;
      return;
    }
    if (listRef.current) {
      listRef.current.scrollToRow(0);
    }
    // 首次加载
    (async () => {
      setLoading(true);
      const res = await searchNetease(keyword, 0);
      if (res.success) {
        setSongs(res.data.result.songs);
        totalCount.current = res.data.result.songCount;
        setHasMore(res.data.result.songs.length < res.data.result.songCount);
        setPage(0);
      } else {
        setSongs([]);
        setHasMore(false);
        totalCount.current = 0;
      }
      setLoading(false);
    })();
  }, [keyword]);

  // 加载下一页
  const loadMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    const nextPage = page + 1;
    const offset = nextPage * 30;
    const res = await searchNetease(keyword, offset);
    if (res.success && res.data.result.songs.length > 0) {
      setSongs((prev) => [...prev, ...res.data.result.songs]);
      setPage(nextPage);
      setHasMore(
        songs.length + res.data.result.songs.length < totalCount.current
      );
    } else {
      setHasMore(false);
    }
    setLoading(false);
  };

  // 虚拟列表渲染
  const rowRenderer = ({ index, key, style }: any) => {
    const item = songs[index];
    return (
      <div key={key} style={style}>
        <SongCard song={item} platform="netease" />
      </div>
    );
  };

  // 监听滚动到底部，滚动到最后 3 行时加载更多
  const handleRowsRendered = ({ stopIndex }: { stopIndex: number }) => {
    if (hasMore && stopIndex >= songs.length - 3 && !loading) {
      loadMore();
    }
  };

  if (!keyword) {
    return (
      <div className="flex-center h-[75%] w-full">
        <div className="title-small text-center">搜索你喜欢的音乐</div>
      </div>
    );
  }

  return (
    <div className="h-[75%] w-full">
      <AutoSizer>
        {({ width, height }: { width: number; height: number }) => {
          const rowHeight = Math.max(
            60,
            Math.floor(height / Math.min(songs.length, 5))
          );
          return (
            <List
              ref={listRef}
              width={width}
              height={height}
              rowCount={songs.length}
              rowHeight={rowHeight}
              overscanRowCount={2}
              rowRenderer={rowRenderer}
              onRowsRendered={handleRowsRendered}
              className="app-region-no-drag"
            />
          );
        }}
      </AutoSizer>
    </div>
  );
}

export default MainContent;
