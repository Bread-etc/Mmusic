import { Button } from "@/components/ui/button";
import { usePlayerStore } from "@/store/player";
import { NeteaseSongItem } from "@/types/NeteaseTypes";
import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { useEffect, useRef } from "react";

function Dock() {
  const { playlist, currentIndex, isPlaying, play, pause, playNext, playPrev } =
    usePlayerStore();
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentSong = playlist[currentIndex];

  /* 控制 audio 播放 */
  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentSong]);

  /* 自动播放下一首 */
  const handleEnded = () => {
    playNext();
  };

  function getSongUrl(currentSong: NeteaseSongItem): string | undefined {
    return undefined;
  }

  return (
    <div className="h-[15%] flex-center w-full px-6">
      <audio
        ref={audioRef}
        src={currentSong ? getSongUrl(currentSong) : ""}
        onEnded={handleEnded}
        preload="auto"
      />
      {/* 歌曲信息 */}
      <div className="flex-1 min-w-0">
        {currentSong ? (
          <>
            <div className="font-bold text-base theme-text truncate">
              {currentSong.name}
            </div>
            <div className="text-caption truncate">
              {currentSong.artists.map((a) => a.name).join(", ")}
            </div>
          </>
        ) : (
          <div className="text-gray-400">暂无播放</div>
        )}
      </div>
      {/* 控制按钮 */}
      <div className="flex items-center gap-2 ml-4">
        <Button size="icon" variant="ghost" onClick={playPrev}>
          <SkipBack className="h-5 w-5" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => (isPlaying ? pause() : play())}
        >
          {isPlaying ? (
            <Pause className="h-6 w-6" />
          ) : (
            <Play className="h-6 w-6" />
          )}
        </Button>
        <Button size="icon" variant="ghost" onClick={playNext}>
          <SkipForward className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}

export default Dock;
