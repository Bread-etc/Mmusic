import { useState } from "react";
import {
  ChevronDown,
  Heart,
  Pause,
  Play,
  Repeat,
  Repeat1,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import { usePlayerStore } from "@/store/player";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { formatTime } from "@/lib/utils";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";

// 根据播放模式返回对应的图标
const PlaybackModeIcon = ({ mode }: { mode: string }) => {
  if (mode === "single") return <Repeat1 size={20} />;
  if (mode === "shuffle") return <Shuffle size={20} />;
  return <Repeat size={20} />;
};

function Dock() {
  const [isVolumeSliderVisible, setVolumeSliderVisible] = useState(false);

  const {
    currentSong: getCurrentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    playbackMode,
    isLiked,
    togglePlay,
    playNext,
    playPrev,
    setCurrentTime,
    setVolume,
    toggleMute,
    cyclePlaybackMode,
    toggleLike,
  } = usePlayerStore();

  const currentSong = getCurrentSong();

  if (!currentSong) {
    return null;
  }

  const handleProgressChange = (value: number[]) => {
    setCurrentTime(value[0]);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };

  const songIsLiked = isLiked(currentSong.id);

  return (
    <Drawer>
      <div className="app-region-no-drag absolute bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-4xl h-20 px-4 bg-slate-50/60 dark:bg-slate-900/60 backdrop-blur-lg rounded-2xl shadow-lg border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
        {/* 左侧：歌曲信息和抽屉触发器 */}
        <DrawerTrigger asChild>
          <div className="w-64 flex items-center gap-3 cursor-pointer group">
            <img
              src={currentSong.cover}
              alt={currentSong.title}
              className="w-14 h-14 rounded-md object-cover"
            />
            <div className="flex flex-col min-w-0">
              <p className="font-bold text-base truncate">
                {currentSong.title}
              </p>
              <p className="text-sm opacity-80 group-hover:underline truncate">
                {currentSong.artist}
              </p>
            </div>
          </div>
        </DrawerTrigger>

        {/* 中间：播放控制和进度条 */}
        <div className="flex-grow flex flex-col items-center justify-center mx-4">
          <div className="flex items-center gap-6">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                playPrev();
              }}
              size="icon"
              variant="ghost"
              className="p-2 "
            >
              <SkipBack size={22} />
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              size="icon"
              className="p-3 w-12 h-12 bg-sky-500 text-white shadow-md hover:scale-105 transition-transform"
            >
              {isPlaying ? (
                <Pause size={28} />
              ) : (
                <Play size={28} className="ml-1" />
              )}
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                playNext();
              }}
              size="icon"
              variant="ghost"
              className="p-2 "
            >
              <SkipForward size={22} />
            </Button>
          </div>
          <div className="w-full flex items-center gap-2 mt-1">
            <span className="text-xs  w-10 text-center">
              {formatTime(currentTime)}
            </span>
            <Slider
              value={[currentTime]}
              max={duration}
              step={1}
              onValueChange={handleProgressChange}
              className="flex-grow"
            />
            <span className="text-xs  w-10 text-center">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* 右侧：其他功能 */}
        <div className="w-64 flex items-center justify-end gap-4">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              toggleLike();
            }}
            size="icon"
            variant="ghost"
            className={`p-1 ${songIsLiked ? "text-red-500" : ""}`}
          >
            <Heart
              size={20}
              className={`${songIsLiked ? "fill-current" : ""}`}
            />
          </Button>

          {/* 播放模式切换按钮 */}
          <Button
            onClick={(e) => {
              e.stopPropagation();
              cyclePlaybackMode();
            }}
            size="icon"
            variant="ghost"
            className="p-1 "
          >
            <PlaybackModeIcon mode={playbackMode} />
          </Button>

          {/* 音量控制（悬浮显示） */}
          <div
            className="relative flex items-center gap-2 w-28"
            onMouseEnter={() => setVolumeSliderVisible(true)}
            onMouseLeave={() => setVolumeSliderVisible(false)}
          >
            <Button
              onClick={(e) => {
                e.stopPropagation();
                toggleMute();
              }}
              variant="ghost"
              size="icon"
              className=""
            >
              {isMuted || volume === 0 ? (
                <VolumeX size={20} />
              ) : (
                <Volume2 size={20} />
              )}
            </Button>
            {isVolumeSliderVisible && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-full">
                <Slider
                  value={isMuted ? [0] : [volume]}
                  max={1}
                  step={0.01}
                  onValueChange={handleVolumeChange}
                  className="w-full"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 抽屉内容：全屏播放页 */}
      <DrawerContent className="h-full bg-transparent border-none outline-none">
        <div className="absolute inset-0 w-full h-full -z-20">
          <img
            src={currentSong.cover}
            className="w-full h-full object-cover blur-3xl scale-110"
            alt="background"
          />
          <div className="absolute inset-0 w-full h-full bg-black/50"></div>
        </div>
        <div className="w-full h-full flex flex-col items-center justify-center p-8 text-white">
          <DrawerClose
            asChild
            className="absolute top-6 left-6 app-region-no-drag"
          >
            <Button variant="ghost" size="icon">
              <ChevronDown size={24} />
            </Button>
          </DrawerClose>
          <img
            src={currentSong.cover}
            alt={currentSong.title}
            className="w-80 h-80 rounded-lg shadow-2xl object-cover"
          />
          <div className="text-center mt-8">
            <h2 className="text-3xl font-bold">{currentSong.title}</h2>
            <p className="text-xl opacity-80 mt-2">{currentSong.artist}</p>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default Dock;
