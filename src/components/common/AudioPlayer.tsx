import { useEffect, useRef } from "react";
import { usePlayerStore } from "@/store/player";

export function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);

  // 正确、精细化地从store选择状态，每个hook只订阅一个值的变化
  const currentSong = usePlayerStore((state) => state.currentSong());
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const volume = usePlayerStore((state) => state.volume);
  const isMuted = usePlayerStore((state) => state.isMuted);
  const currentTime = usePlayerStore((state) => state.currentTime);
  const setCurrentTime = usePlayerStore((state) => state.setCurrentTime);
  const setDuration = usePlayerStore((state) => state.setDuration);
  const playNext = usePlayerStore((state) => state.playNext);

  // Effect to handle play/pause
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch((error) => {
        // 自动播放可能会被浏览器阻止，这里静默处理或给出提示
        console.error("Audio play failed:", error);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // Effect to handle song change
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    // 仅在歌曲url确实变化时才更新src并加载
    if (audio.src !== currentSong.url) {
      audio.src = currentSong.url;
      audio.load();
      if (isPlaying) {
        audio.play().catch((error) => {
          console.error("Audio play on song change failed:", error);
        });
      }
    }
  }, [currentSong, isPlaying]); // 依赖currentSong对象本身

  // Effect to handle volume/mute change
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  // Effect to handle seeking (user dragging progress bar)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // 仅在用户拖动进度条，导致时间差大于1.5秒时才强制更新，避免与onTimeUpdate冲突
    if (Math.abs(audio.currentTime - currentTime) > 1.5) {
      audio.currentTime = currentTime;
    }
  }, [currentTime]);

  // === Audio Element Event Handlers ===
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  return (
    <audio
      ref={audioRef}
      onTimeUpdate={handleTimeUpdate}
      onLoadedMetadata={handleLoadedMetadata}
      onEnded={playNext} // Automatically play next song when one ends
      className="hidden"
    />
  );
}