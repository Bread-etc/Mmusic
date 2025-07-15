import { useEffect, useRef } from "react";
import { usePlayerStore } from "@/store/player";

export function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);

  // 从 Store 中订阅需要的“状态”和“Actions”
  const currentSong = usePlayerStore((state) => state.currentSong());
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const volume = usePlayerStore((state) => state.volume);
  const isMuted = usePlayerStore((state) => state.isMuted);
  const seekTime = usePlayerStore((state) => state.currentTime); // 用于拖动
  const setCurrentTime = usePlayerStore((state) => state.setCurrentTime);
  const setDuration = usePlayerStore((state) => state.setDuration);

  // 编写 Effect Hooks，将 Store 状态同步到 <audio> 元素

  // 当【当前歌曲】变化时，更新 <audio> 的 src
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    if (audio.src !== currentSong.url) {
      audio.src = currentSong.url;
      audio.load();
    }
  }, [currentSong]);

  // 当【播放状态】变化时，控制 <audio> 播放或暂停
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch((err) => console.error("播放失败:", err));
    } else {
      audio.pause();
    }
  }, [isPlaying, currentSong]); // 也依赖currentSong，确保切歌后能立即播放

  // 当【音量或静音状态】变化时，更新 <audio> 的音量
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  // 当用户【拖动进度条】(seek)时，更新 <audio> 的播放时间
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // 仅在时间差大于1.5秒时才进行seek，避免与onTimeUpdate的频繁更新冲突
    if (Math.abs(audio.currentTime - seekTime) > 1.5) {
      audio.currentTime = seekTime;
    }
  }, [seekTime]);

  // 为 <audio> 元素绑定事件处理器，将 <audio> 的变化同步回 Store

  // 当音频元素的播放时间更新时，调用 action 更新 store
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // 当音频加载完成，可以获取到总时长时，调用 action 更新 store
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  // 当音频播放结束时，调用 action 播放下一首
  const handleEnded = () => {
    const { playbackMode, playNext } = usePlayerStore.getState();
    if (playbackMode === "single") {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else {
      playNext();
    }
  };

  return (
    <audio
      ref={audioRef}
      onTimeUpdate={handleTimeUpdate}
      onLoadedMetadata={handleLoadedMetadata}
      onEnded={handleEnded}
      className="hidden"
    />
  );
}
