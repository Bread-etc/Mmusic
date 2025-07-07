/**
 * 音频播放器
 * @interface AudioState 音频状态接口
 * @interface SongInfo 歌曲信息接口
 * @interface PlayListState 播放列表接口
 * @interface PlayerEvents 播放器事件接口
 * @function generateShuffledOrder 生成随机歌单
 * @function useAudioPlayer 播放器 Hook
 */
import { useCallback, useEffect, useState } from "react";

export interface AudioState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isShuffled: boolean; // 随机播放
  repeatMode: "none" | "one" | "all"; // 播放模式
  isLoading: boolean;
  error: string | null;
}

export interface SongInfo {
  id: string;
  title: string;
  artist: string;
  album: string;
  cover?: string;
  url: string;
  duration: number;
  source?: "netease" | "kugou" | "qq" | "bilibili";
  quality?:
    | "standard"
    | "higher"
    | "exhigh"
    | "lossless"
    | "hires"
    | "jyeffect"
    | "sky"
    | "jymaster";
}

export interface PlayListState {
  id: string;
  name: string;
  songs: SongInfo[];
  currentIndex: number;
  originalOrder: number[]; // 原始歌单
  shuffledOrder: number[]; // 随机歌单
}

export interface PlayerEvents {
  onSongChange?: (song: SongInfo) => void;
  onPlayStateChange?: (isPlaying: boolean) => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onVolumeChange?: (volume: number) => void;
  onError?: (error: string) => void;
}

// 初始化音频状态
const initialAudioState: AudioState = {
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 1,
  isMuted: false,
  isShuffled: false,
  repeatMode: "none",
  isLoading: false,
  error: null,
};

// 初始化播放列表状态
const initialPlaylistState: PlayListState = {
  id: "",
  name: "",
  songs: [],
  currentIndex: 0,
  originalOrder: [],
  shuffledOrder: [],
};

// 生成随机播放顺序
const generateShuffledOrder = (
  length: number,
  currentIndex: number
): number[] => {
  const order = Array.from({ length }, (_, i) => i);
  const shuffled = [...order];

  // Fisher-Yates 洗牌算法
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // 确保当前歌曲在第一位
  const currentPos = shuffled.indexOf(currentIndex);
  if (currentPos !== 0) {
    [shuffled[0], shuffled[currentPos]] = [shuffled[currentPos], shuffled[0]];
  }

  return shuffled;
};

// 音频播放器 useAudioPlayer Hook
export const useAudioPlayer = (events?: PlayerEvents) => {
  const [audioState, setAudioState] = useState<AudioState>(initialAudioState);
  const [playlist, setPlaylist] = useState<PlayListState>(initialPlaylistState);
  const [isLiked, setIsLiked] = useState(false);

  const currentSong = playlist.songs[playlist.currentIndex];

  // 更新音频状态
  const updateAudioState = useCallback((updates: Partial<AudioState>) => {
    setAudioState((prev) => ({ ...prev, ...updates }));
  }, []);

  // 设置播放列表
  const setPlaylistSongs = useCallback(
    (songs: SongInfo[], startIndex: number = 0) => {
      const originalOrder = Array.from({ length: songs.length }, (_, i) => i);
      const shuffledOrder = generateShuffledOrder(songs.length, startIndex);

      setPlaylist({
        songs,
        currentIndex: startIndex,
        originalOrder,
        shuffledOrder,
        name: `播放列表 - ${new Date().toLocaleString()}`,
        id: `playlist_${Date.now()}`,
      });
    },
    []
  );

  // 添加歌曲到播放列表
  const addSongToPlaylist = useCallback(
    (song: SongInfo) => {
      setPlaylist((prev) => {
        const newSongs = [...prev.songs, song];
        const newOriginalOrder = Array.from(
          { length: newSongs.length },
          (_, i) => i
        );
        const newShuffledOrder = audioState.isShuffled
          ? generateShuffledOrder(newSongs.length, prev.currentIndex)
          : newOriginalOrder;

        return {
          ...prev,
          songs: newSongs,
          originalOrder: newOriginalOrder,
          shuffledOrder: newShuffledOrder,
        };
      });
    },
    [audioState.isShuffled]
  );

  // 从播放列表移除歌曲
  const removeSongFromPlaylist = useCallback(
    (index: number) => {
      setPlaylist((prev) => {
        const newSongs = prev.songs.filter((_, i) => i !== index);
        const newOriginalOrder = Array.from(
          { length: newSongs.length },
          (_, i) => i
        );
        let newCurrentIndex = prev.currentIndex;

        if (index < prev.currentIndex) {
          newCurrentIndex = prev.currentIndex - 1;
        } else if (index === prev.currentIndex) {
          newCurrentIndex = Math.min(prev.currentIndex, newSongs.length - 1);
        }

        const newShuffledOrder = audioState.isShuffled
          ? generateShuffledOrder(newSongs.length, newCurrentIndex)
          : newOriginalOrder;

        return {
          ...prev,
          songs: newSongs,
          currentIndex: Math.max(0, newCurrentIndex),
          originalOrder: newOriginalOrder,
          shuffledOrder: newShuffledOrder,
        };
      });
    },
    [audioState.isShuffled]
  );

  // 播放指定歌曲
  const playSong = useCallback(
    (index: number) => {
      if (index >= 0 && index < playlist.songs.length) {
        setPlaylist((prev) => ({
          ...prev,
          currentIndex: index,
        }));
        updateAudioState({ isPlaying: true });
      }
    },
    [playlist.songs.length, updateAudioState]
  );

  // 播放/暂停切换
  const togglePlay = useCallback(() => {
    if (currentSong) {
      const newIsPlaying = !audioState.isPlaying;
      updateAudioState({ isPlaying: newIsPlaying });
      events?.onPlayStateChange?.(newIsPlaying);
    }
  }, [audioState.isPlaying, currentSong, updateAudioState, events]);

  // 上一首
  const playPrevious = useCallback(() => {
    if (playlist.songs.length === 0) return;

    const order = audioState.isShuffled
      ? playlist.shuffledOrder
      : playlist.originalOrder;
    const currentOrderIndex = order.indexOf(playlist.currentIndex);
    const prevIndex =
      currentOrderIndex > 0 ? currentOrderIndex - 1 : order.length - 1;
    const newSongIndex = order[prevIndex];

    setPlaylist((prev) => ({
      ...prev,
      currentIndex: newSongIndex,
    }));

    updateAudioState({ isPlaying: true });
  }, [playlist, audioState.isShuffled, updateAudioState]);

  // 下一首
  const playNext = useCallback(() => {
    if (playlist.songs.length === 0) return;

    const order = audioState.isShuffled
      ? playlist.shuffledOrder
      : playlist.originalOrder;
    const currentOrderIndex = order.indexOf(playlist.currentIndex);
    const nextIndex =
      currentOrderIndex < order.length - 1 ? currentOrderIndex + 1 : 0;
    const newSongIndex = order[nextIndex];

    setPlaylist((prev) => ({
      ...prev,
      currentIndex: newSongIndex,
    }));

    updateAudioState({ isPlaying: true });
  }, [playlist, audioState.isShuffled, updateAudioState]);

  // 切换随机播放
  const toggleShuffle = useCallback(() => {
    const newIsShuffled = !audioState.isShuffled;
    updateAudioState({ isShuffled: newIsShuffled });

    if (newIsShuffled) {
      setPlaylist((prev) => ({
        ...prev,
        shuffledOrder: generateShuffledOrder(
          prev.songs.length,
          prev.currentIndex
        ),
      }));
    }
  }, [audioState.isShuffled, updateAudioState]);

  // 切换重复模式
  const toggleRepeat = useCallback(() => {
    const modes: ("none" | "one" | "all")[] = ["none", "all", "one"];
    const currentModeIndex = modes.indexOf(audioState.repeatMode);
    const nextMode = modes[(currentModeIndex + 1) % modes.length];

    updateAudioState({ repeatMode: nextMode });
  }, [audioState.repeatMode, updateAudioState]);

  // 设置音量
  const setVolume = useCallback(
    (volume: number) => {
      const clampedVolume = Math.max(0, Math.min(1, volume));
      updateAudioState({
        volume: clampedVolume,
        isMuted: clampedVolume === 0,
      });
      events?.onVolumeChange?.(clampedVolume);
    },
    [updateAudioState, events]
  );

  // 切换静音
  const toggleMute = useCallback(() => {
    const newIsMuted = !audioState.isMuted;
    updateAudioState({ isMuted: newIsMuted });
    events?.onVolumeChange?.(newIsMuted ? 0 : audioState.volume);
  }, [audioState.isMuted, audioState.volume, updateAudioState, events]);

  // 设置播放时间
  const setCurrentTime = useCallback(
    (time: number) => {
      if (audioState.duration > 0) {
        const clampedTime = Math.max(0, Math.min(audioState.duration, time));
        updateAudioState({ currentTime: clampedTime });
        events?.onTimeUpdate?.(clampedTime, audioState.duration);
      }
    },
    [audioState.duration, updateAudioState, events]
  );

  // 设置播放进度（百分比）
  const setProgress = useCallback(
    (progress: number) => {
      if (audioState.duration > 0) {
        const clampedProgress = Math.max(0, Math.min(100, progress));
        const newTime = (clampedProgress / 100) * audioState.duration;
        setCurrentTime(newTime);
      }
    },
    [audioState.duration, setCurrentTime]
  );

  // 处理音频加载完成
  const handleLoadedMetadata = useCallback(
    (duration: number) => {
      updateAudioState({ duration, isLoading: false });
    },
    [updateAudioState]
  );

  // 处理音频时间更新
  const handleTimeUpdate = useCallback(
    (currentTime: number) => {
      updateAudioState({ currentTime });
      events?.onTimeUpdate?.(currentTime, audioState.duration);
    },
    [audioState.duration, updateAudioState, events]
  );

  // 处理音频播放结束
  const handleAudioEnded = useCallback(() => {
    if (audioState.repeatMode === "one") {
      setCurrentTime(0);
      updateAudioState({ isPlaying: true });
    } else if (
      audioState.repeatMode === "all" ||
      playlist.currentIndex < playlist.songs.length - 1
    ) {
      playNext();
    } else {
      updateAudioState({ isPlaying: false });
    }
  }, [
    audioState.repeatMode,
    playlist.currentIndex,
    playlist.songs.length,
    setCurrentTime,
    updateAudioState,
    playNext,
  ]);

  // 处理音频错误
  const handleAudioError = useCallback(
    (error: string) => {
      updateAudioState({
        error,
        isLoading: false,
        isPlaying: false,
      });
      events?.onError?.(error);
    },
    [updateAudioState, events]
  );

  // 清除错误
  const clearError = useCallback(() => {
    updateAudioState({ error: null });
  }, [updateAudioState]);

  // 切换收藏状态
  const toggleLike = useCallback(() => {
    setIsLiked((prev) => !prev);
  }, []);

  // 格式化时间显示
  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }, []);

  // 获取播放进度百分比
  const getProgressPercentage = useCallback((): number => {
    return audioState.duration > 0
      ? (audioState.currentTime / audioState.duration) * 100
      : 0;
  }, [audioState.currentTime, audioState.duration]);

  // 获取音量百分比
  const getVolumePercentage = useCallback((): number => {
    return audioState.volume * 100;
  }, [audioState.volume]);

  // 检查是否有上一首
  const hasPrevious = useCallback((): boolean => {
    if (playlist.songs.length === 0) return false;
    const order = audioState.isShuffled
      ? playlist.shuffledOrder
      : playlist.originalOrder;
    const currentOrderIndex = order.indexOf(playlist.currentIndex);
    return currentOrderIndex > 0;
  }, [playlist, audioState.isShuffled]);

  // 检查是否有下一首
  const hasNext = useCallback((): boolean => {
    if (playlist.songs.length === 0) return false;
    const order = audioState.isShuffled
      ? playlist.shuffledOrder
      : playlist.originalOrder;
    const currentOrderIndex = order.indexOf(playlist.currentIndex);
    return currentOrderIndex < order.length - 1;
  }, [playlist, audioState.isShuffled]);

  // 获取播放模式描述
  const getRepeatModeText = useCallback((): string => {
    switch (audioState.repeatMode) {
      case "none":
        return "不重复";
      case "all":
        return "列表循环";
      case "one":
        return "单曲循环";
      default:
        return "不重复";
    }
  }, [audioState.repeatMode]);

  // 监听当前歌曲变化
  useEffect(() => {
    if (currentSong) {
      updateAudioState({ isLoading: true, error: null });
      events?.onSongChange?.(currentSong);
    }
  }, [currentSong, updateAudioState, events]);

  // 从本地存储加载设置
  useEffect(() => {
    const savedVolume = localStorage.getItem("audioPlayerVolume");
    const savedRepeatMode = localStorage.getItem("audioPlayerRepeatMode");
    const savedIsShuffled = localStorage.getItem("audioPlayerIsShuffled");

    if (savedVolume) {
      const volume = parseFloat(savedVolume);
      if (!isNaN(volume)) {
        updateAudioState({ volume: Math.max(0, Math.min(1, volume)) });
      }
    }

    if (savedRepeatMode && ["none", "one", "all"].includes(savedRepeatMode)) {
      updateAudioState({
        repeatMode: savedRepeatMode as "none" | "one" | "all",
      });
    }

    if (savedIsShuffled) {
      updateAudioState({ isShuffled: savedIsShuffled === "true" });
    }
  }, [updateAudioState]);

  // 保存设置到本地存储
  useEffect(() => {
    localStorage.setItem("audioPlayerVolume", audioState.volume.toString());
    localStorage.setItem("audioPlayerRepeatMode", audioState.repeatMode);
    localStorage.setItem(
      "audioPlayerIsShuffled",
      audioState.isShuffled.toString()
    );
  }, [audioState.volume, audioState.repeatMode, audioState.isShuffled]);

  return {
    // 状态
    audioState,
    playlist,
    currentSong,
    isLiked,

    // 播放控制
    togglePlay,
    playPrevious,
    playNext,
    playSong,

    // 播放列表管理
    setPlaylistSongs,
    addSongToPlaylist,
    removeSongFromPlaylist,

    // 播放设置
    toggleShuffle,
    toggleRepeat,
    setVolume,
    toggleMute,

    // 进度控制
    setCurrentTime,
    setProgress,

    // 事件处理
    handleLoadedMetadata,
    handleTimeUpdate,
    handleAudioEnded,
    handleAudioError,
    clearError,

    // 其他功能
    toggleLike,
    formatTime,
    getProgressPercentage,
    getVolumePercentage,
    hasPrevious,
    hasNext,
    getRepeatModeText,
  };
};
