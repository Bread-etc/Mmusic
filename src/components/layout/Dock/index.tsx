import { useState } from "react";
import {
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  Heart,
  Music2,
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
import { cn, formatTime } from "@/lib/utils";
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

export function Dock() {
  const [isVolumeSliderVisible, setVolumeSliderVisible] = useState(false);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isShadowVisible, setIsShadowVisible] = useState(true);

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

  const handleOpenChange = (open: boolean) => {
    setDrawerOpen(open);
    if (open) {
      setIsShadowVisible(false);
    } else {
      setTimeout(() => {
        setIsShadowVisible(true);
      }, 500);
    }
  };

  const handleProgressChange = (value: number[]) => {
    setCurrentTime(value[0]);
  };
  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };

  return (
    <Drawer.Root open={isDrawerOpen} onOpenChange={handleOpenChange}>
      <div
        className={cn(
          "flex-between app-region-no-drag px-4 py-2 rounded-2xl shadow-material backdrop-blur-sm bg-card/20 transition-shadow duration-300",
          { "shadow-lg": isShadowVisible }
        )}
      >
        {/* 左侧：歌曲信息和抽屉触发器 */}
        <Drawer.Trigger
          asChild={!!currentSong}
          className={`${!currentSong ? "border-none bg-transparent" : ""}`}
        >
          <div className="w-64 flex items-center gap-4 cursor-pointer group">
            {currentSong ? (
              <img
                src={currentSong.cover}
                alt={currentSong.title}
                className="w-12 h-12 rounded-md object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-md bg-muted flex-center">
                <Music2 size={24} className="text-muted-foreground" />
              </div>
            )}

            <div className="flex flex-col min-w-0">
              <p className="text-title-small truncate">
                {currentSong ? currentSong.title : "暂无歌曲"}
              </p>
              <p className="text-caption truncate">
                {currentSong ? currentSong.artist : "请选择歌曲"}
              </p>
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
              disabled={!currentSong}
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
              disabled={!currentSong}
            >
              {isPlaying ? (
                <Pause className="fill-current text-primary" size={24} />
              ) : (
                <Play className="fill-current text-primary" size={24} />
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
              disabled={!currentSong}
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
              {currentSong ? formatTime(currentTime) : "00:00"}
            </span>
            <Slider
              value={[currentTime]}
              max={duration}
              step={1}
              onValueChange={handleProgressChange}
              className="flex-grow"
              disabled={!currentSong}
            />
            <span className="text-xs w-8 text-center tracking-wide">
              {currentSong ? formatTime(duration) : "00:00"}
            </span>
          </div>
        </div>

        {/* 右侧：其他功能 */}
        <div className="w-64 flex-center gap-4">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              toggleLike();
            }}
            size="icon"
            variant="ghost"
            className={`btn-reset ${currentSong && isLiked(currentSong.id) ? "text-red-500" : ""}`}
            disabled={!currentSong}
          >
            <Heart
              size={20}
              className={`${currentSong && isLiked(currentSong.id) ? "fill-current" : ""} hover:fill-current`}
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
            disabled={!currentSong}
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
              disabled={!currentSong}
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
            {isVolumeSliderVisible && currentSong && (
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
      {currentSong && (
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 z-50 bg-background rounded-[10px]" />
          <Drawer.Content className="fixed inset-0 z-50 flex flex-col h-full outline-none">
            <div className="absolute inset-0 -z-10 rounded-[10px] overflow-hidden">
              <img
                src={currentSong.cover}
                className="w-full h-full object-cover blur-3xl scale-120"
                alt="background"
              />
              <div className="absolute inset-0 w-full h-full bg-black/20" />
            </div>

            <div className="relative flex-center h-full w-full flex-col text-white">
              <Drawer.Close
                asChild
                className="absolute top-4 left-4 app-region-no-drag"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="btn-reset text-primary-foreground hover:text-primary transition-colors duration-200"
                >
                  <ChevronDown size={24} />
                </Button>
              </Drawer.Close>
              <img
                src={currentSong.cover}
                alt={currentSong.title}
                className="w-70 h-70 rounded-lg object-cover shadow-2xl"
              />
              <div className="mt-4 text-center">
                <Drawer.Title className="font-noto font-extrabold tracking-wide">
                  {currentSong.title}
                </Drawer.Title>
                <Drawer.Description className="mt-2 opacity-80">
                  {currentSong.artist}
                </Drawer.Description>
              </div>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      )}
    </Drawer.Root>
  );
}
