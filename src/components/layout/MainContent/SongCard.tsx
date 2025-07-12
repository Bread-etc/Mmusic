import { useState } from "react";
import { Play, Volume2, LoaderCircle } from "lucide-react";
import { toast } from "sonner";

import { usePlayerStore } from "@/store/player";
import { NeteaseSongItem } from "@/types/NeteaseTypes";
import { songDetailNetease, songUrlNetease } from "@/lib/music/neteaseService";
import { transformNeteaseSong } from "@/lib/music/utils";
import { formatTime } from "@/lib/utils";

interface SongCardProps {
  index: number;
  song: NeteaseSongItem;
}

export function SongCard({ song, index }: SongCardProps) {
  const [isFetchingUrl, setIsFetchingUrl] = useState(false);

  // 正确地从 Zustand store 中选择状态，避免不必要的重渲染
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const currentSongId = usePlayerStore((state) => state.currentSong()?.id);
  const playSongNow = usePlayerStore((state) => state.playSongNow);
  const togglePlay = usePlayerStore((state) => state.togglePlay);

  const songInfo = transformNeteaseSong(song);
  const isCurrentSong = currentSongId === songInfo.id;

  const handlePlay = async () => {
    // 如果点击的是当前正在播放的歌曲，则切换播放/暂停状态
    if (isCurrentSong) {
      togglePlay();
      return;
    }

    setIsFetchingUrl(true);
    try {
      const res = await songUrlNetease(song.id.toString(), "standard");
      const resDetail = await songDetailNetease(song.id.toString());
      const songUrlData = res.data.data[0];
      const picUrl = resDetail.data.songs[0].al.picUrl;

      if (!songUrlData || !songUrlData.url) {
        toast.error("获取播放地址失败，可能需要VIP权限");
        return;
      }

      const playableSong = { ...songInfo, url: songUrlData.url, cover: picUrl };
      playSongNow(playableSong);
    } catch (error) {
      console.error("播放歌曲时出错:", error);
      toast.error("播放失败，请检查网络或稍后再试");
    } finally {
      setIsFetchingUrl(false);
    }
  };

  return (
    <div
      className={`flex items-center p-2 rounded-lg cursor-pointer transition-colors duration-200 ${
        isCurrentSong
          ? "bg-sky-100 dark:bg-sky-900/50"
          : "hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
      }`}
      onClick={handlePlay}
    >
      {/* 左侧：索引或播放/加载图标 */}
      <div className="w-10 flex-center text-sm  opacity-60">
        {isFetchingUrl ? (
          <LoaderCircle className="w-5 h-5 animate-spin text-sky-500" />
        ) : isCurrentSong && isPlaying ? (
          <Volume2 className="w-5 h-5 text-sky-500" />
        ) : (
          // 默认显示索引，当鼠标悬浮时隐藏
          <span className="group-hover:hidden">{index + 1}</span>
        )}
        {/* 鼠标悬浮时显示播放按钮 (如果不是加载中或正在播放) */}
        <Play
          className={`w-5 h-5 hidden group-hover:block  opacity-80${
            isFetchingUrl || (isCurrentSong && isPlaying) ? " !hidden" : ""
          }`}
        />
      </div>

      {/* 中部：歌曲信息 */}
      <div className="flex-1 min-w-0 mx-2">
        <p
          className={`font-medium truncate ${
            isCurrentSong ? "text-sky-600 dark:text-sky-400" : ""
          }`}
        >
          {songInfo.title}
        </p>
        <p className="text-sm  opacity-70 truncate">{songInfo.artist}</p>
      </div>

      {/* 右侧：歌曲时长 */}
      <div className="w-16 text-right text-sm  opacity-70">
        {formatTime(songInfo.duration)}
      </div>
    </div>
  );
}
