import { useState } from "react";
import {
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  Heart,
  Pause,
  Play,
  Repeat,
  Repeat1,
  Shuffle,
  Volume2,
  VolumeOff,
} from "lucide-react";
import { usePlayerStore } from "@/store/player";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { formatTime } from "@/lib/utils";
import { Drawer } from "vaul";

// 根据播放模式返回对应的图标
const PlaybackModeIcon = ({ mode }: { mode: string }) => {
  if (mode === "single")
    return (
      <Repeat1
        size={20}
        className="hover-text-primary transition-colors duration-200"
      />
    );
  if (mode === "shuffle")
    return (
      <Shuffle
        size={20}
        className="hover-text-primary transition-colors duration-200"
      />
    );
  return (
    <Repeat
      size={20}
      className="hover-text-primary transition-colors duration-200"
    />
  );
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
    <Drawer.Root>
      <div className="flex-between app-region-no-drag absolute bottom-5 left-1/2 -translate-x-1/2 w-[95%] px-4 py-2 rounded-2xl shadow-lg backdrop-blur-sm bg-card/20">
        {/* 左侧：歌曲信息和抽屉触发器 */}
        <Drawer.Trigger asChild>
          <div className="w-64 flex items-center gap-4 cursor-pointer group">
            <img
              src={currentSong.cover}
              alt={currentSong.title}
              className="w-12 h-12 rounded-md object-cover"
            />
            <div className="flex flex-col min-w-0">
              <p className="text-title-small truncate">{currentSong.title}</p>
              <p className="text-caption truncate">{currentSong.artist}</p>
            </div>
          </div>
        </Drawer.Trigger>

        {/* 中间：播放控制和进度条 */}
        <div className="flex-grow flex-col-center mx-2">
          <div className="flex items-center gap-1">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                playPrev();
              }}
              size="icon"
              variant="ghost"
              className="btn-reset"
            >
              <ChevronsLeft
                className="hover:text-primary transition-colors duration-200"
                size={20}
                strokeWidth={3}
              />
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              size="icon"
              variant="ghost"
              className="btn-reset"
            >
              {isPlaying ? (
                <Pause
                  className="hover:text-primary transition-colors duration-200"
                  size={24}
                  strokeWidth={2}
                />
              ) : (
                <Play
                  className="hover:text-primary transition-colors duration-200"
                  size={24}
                  strokeWidth={2}
                />
              )}
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                playNext();
              }}
              size="icon"
              variant="ghost"
              className="btn-reset"
            >
              <ChevronsRight
                className="hover:text-primary transition-colors duration-200"
                size={20}
                strokeWidth={3}
              />
            </Button>
          </div>
          <div className="w-full flex items-center gap-2">
            <span className="text-xs w-8 text-center tracking-wide">
              {formatTime(currentTime)}
            </span>
            <Slider
              value={[currentTime]}
              max={duration}
              step={1}
              onValueChange={handleProgressChange}
              className="flex-grow"
            />
            <span className="text-xs w-8 text-center tracking-wide">
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
            className={`btn-reset ${songIsLiked ? "text-red-500" : ""}`}
          >
            <Heart
              size={20}
              className={`${songIsLiked ? "fill-current" : ""} hover:fill-current`}
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
            className="btn-reset"
          >
            <PlaybackModeIcon mode={playbackMode} />
          </Button>

          {/* 音量控制（悬浮显示） */}
          <div
            className="relative flex items-center"
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
              className="btn-reset"
            >
              {isMuted || volume === 0 ? (
                <VolumeOff
                  size={20}
                  className="hover-text-primary transition-colors duration-200"
                />
              ) : (
                <Volume2
                  size={20}
                  className="hover-text-primary transition-colors duration-200"
                />
              )}
            </Button>

            {/* 悬浮显示的音量条 */}
            {isVolumeSliderVisible && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2">
                <div className="bg-foreground/10 backdrop-blur-sm p-4 rounded-md shadow-lg flex-center h-32">
                  <Slider
                    orientation="vertical"
                    value={isMuted ? [0] : [volume]}
                    max={1}
                    step={0.01}
                    onValueChange={handleVolumeChange}
                    className="w-2"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 抽屉内容：全屏播放页 */}
      <Drawer.Content className="h-full bg-transparent border-none outline-none">
        <div className="absolute inset-0 w-full h-full -z-20">
          <img
            src={currentSong.cover}
            className="w-full h-full object-cover blur-3xl scale-110"
            alt="background"
          />
          <div className="absolute inset-0 w-full h-full bg-black/50"></div>
        </div>
        <div className="w-full h-full flex flex-col items-center justify-center p-8 text-white">
          <Drawer.Close
            asChild
            className="absolute top-6 left-6 app-region-no-drag"
          >
            <Button variant="ghost" size="icon">
              <ChevronDown size={24} />
            </Button>
          </Drawer.Close>
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
      </Drawer.Content>
    </Drawer.Root>
  );
}

export default Dock;
