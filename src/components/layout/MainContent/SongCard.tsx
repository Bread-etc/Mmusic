import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";
import { usePlayerStore } from "@/store/player";
import type { NeteaseSongItem } from "@/types/NeteaseTypes";

interface SongCardProps {
  index: number;
  song: NeteaseSongItem;
  platform: "netease";
}

function SongCard({ index, song }: SongCardProps) {
  const {
    playlist,
    currentIndex,
    isPlaying,
    setCurrentIndex,
    play
  } = usePlayerStore();

  /**
   * 计算播放时间格式化
   * @param duration 时长(ms)
   * @returns 格式化的时间字符串
   */
  const calcPlayTime = (duration: number): string => {
    let time = Math.floor(duration / 1000);
    let second = time % 60;
    let min = (time - second) / 60;
    return `${String(min).padStart(2, "0")}:${String(second).padEnd(2, "0")}`;
  };

  /**
   * 处理播放按钮点击
   * 如果是当前歌曲且正在播放，则暂停
   * 如果是其他歌曲或当前歌曲未播放，则播放
   */
  const handlePlayClick = () => {
    const isCurrentSong = playlist[currentIndex]?.id === song.id;

    if (isCurrentSong && isPlaying) {
      play();
    } else {
      if (!isCurrentSong) {
        setCurrentIndex(index);
      }
      play();
    }
  }

  const isCurrentSong = playlist[currentIndex]?.id === song.id;
  const showPauseIcon = isCurrentSong && isPlaying;

  return (
    <div className="h-full flex items-center px-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200">
      {/* 序号 */}
      <div className="title-small w-6 font-bold">
        {isCurrentSong && isPlaying ? (
          <div className="flex items-center justify-center">
            <div className="flex space-x-1">
              <div className="w-1 h-3 bg-blue-500 animate-pulse"></div>
              <div className="w-1 h-2 bg-blue-500 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-1 h-4 bg-blue-500 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        ) : (index + 1)}
      </div>

      {/* 歌曲信息 */}
      <div className="flex-1 flex flex-col justify-center ml-4">
        <span className={`text-lg font-bold truncate ${isCurrentSong ? 'text-blue-500' : 'theme-text'
          }`}>
          {song.name}
        </span>
        <span className={`text-caption ${isCurrentSong ? 'text-blue-400' : ''
          }`}>
          {song.artists.map((artist) => artist.name).join(", ")}
        </span>
      </div>

      {/* 歌曲时长 */}
      <div className="text-caption mr-4">{calcPlayTime(song.duration)}</div>

      {/* 播放按钮 */}
      <Button
        size="icon"
        variant="outline"
        className={`h-10 w-10 rounded-full btn-no-border transition-all duration-200 ${isCurrentSong
          ? 'bg-blue-500 hover:bg-blue-600 text-white border-blue-500'
          : 'theme-text hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        onClick={handlePlayClick}
      >
        {showPauseIcon ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}

export default SongCard;
