import { Heart, Pause, Play, Repeat, Repeat1, Shuffle, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";
import { usePlayerStore } from "@/store/player";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { formatTime } from "@/lib/utils";

function Dock() {
  const {
    currentSong: getCurrentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    repeatMode,
    isShuffled,
    isLiked,
    togglePlay,
    playNext,
    playPrev,
    setCurrentTime,
    setVolume,
    toggleMute,
    toggleRepeat,
    toggleShuffle,
    toggleLike,
  } = usePlayerStore();

  const currentSong = getCurrentSong(); // 调用函数获取真实的歌曲对象

  if (!currentSong) {
    return null; // 如果没有当前播放歌曲，不渲染Dock
  }

  const handleProgressChange = (value: number[]) => {
    setCurrentTime(value[0]);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };

  const songIsLiked = isLiked(currentSong.id);

  return (
    <div className="app-region-no-drag absolute bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-4xl h-20 px-6 bg-slate-50/60 dark:bg-slate-900/60 backdrop-blur-lg rounded-2xl shadow-lg border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
      {/* 占位，保持中间部分居中 */}
      <div className="w-64 hidden md:block"></div>

      {/* 中间：播放控制和进度条 */}
      <div className="flex-grow flex flex-col items-center justify-center mx-4">
        {/* 上层：播放控制按钮 */}
        <div className="flex items-center gap-4">
          <Button onClick={toggleShuffle} size="icon" variant="ghost" className={`p-1 ${isShuffled ? "text-sky-500" : "theme-text"} hover:bg-black/5 dark:hover:bg-white/5`}>
            <Shuffle size={20} />
          </Button>
          <Button onClick={playPrev} size="icon" variant="ghost" className="p-2 theme-text hover:bg-black/5 dark:hover:bg-white/5">
            <SkipBack size={22} />
          </Button>
          <Button onClick={togglePlay} size="icon" className="p-3 bg-sky-500 text-white shadow-md hover:scale-105 transition-transform">
            {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
          </Button>
          <Button onClick={playNext} size="icon" variant="ghost" className="p-2 theme-text-primary hover:bg-black/5 dark:hover:bg-white/5">
            <SkipForward size={22} />
          </Button>
          <Button onClick={toggleRepeat} size="icon" variant="ghost" className={`p-1 ${repeatMode === "one" ? "text-sky-500" : repeatMode === 'all' ? 'text-sky-500' : 'theme-text-secondary'} hover:bg-black/5 dark:hover:bg-white/5`}>
            {repeatMode === "one" ? <Repeat1 size={20} className="text-sky-500" /> : <Repeat size={20} className={`${repeatMode === 'all' ? 'text-sky-500' : ''}`} />}
          </Button>
        </div>

        {/* 下层：进度条 */}
        <div className="w-full flex items-center gap-2 mt-1">
          <span className="text-xs theme-text w-10 text-center">{formatTime(currentTime)}</span>
          <Slider
            value={[currentTime]}
            max={duration}
            step={1}
            onValueChange={handleProgressChange}
            className="flex-grow"
          />
          <span className="text-xs theme-text w-10 text-center">{formatTime(duration)}</span>
        </div>
      </div>

      {/* 右侧：其他功能 */}
      <div className="w-64 flex items-center justify-end gap-4">
        <Button onClick={toggleLike} size="icon" variant="ghost" className={`p-1 ${songIsLiked ? "text-red-500 fill-current" : "theme-text"} hover:bg-black/5 dark:hover:bg-white/5`}>
          <Heart size={20} className={`${songIsLiked ? "text-red-500 fill-current" : "theme-text"}`} />
        </Button>
        <div className="flex items-center gap-2 w-28">
          <Button onClick={toggleMute} variant="ghost" size="icon" className="theme-text">
            {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </Button>
          <Slider
            value={isMuted ? [0] : [volume]}
            max={1}
            step={0.01}
            onValueChange={handleVolumeChange}
            className="flex-grow"
          />
        </div>
      </div>
    </div>
  );
}

export default Dock;