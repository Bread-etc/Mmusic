import { create } from "zustand";
import { persist } from "zustand/middleware";

// 定义一个标准、与平台无关的歌曲信息接口
export interface SongInfo {
  id: string;
  title: string;
  artist: string;
  album: string;
  cover: string;
  url: string;
  duration: number; // 单位：s
  source?: "netease" | "kugou" | "qq" | "bilibili";
  originalData?: any; // 选择性保留原始数据
}

// 定义 Store 状态 以及 Actions 接口
interface PlayerStore {
  // 状态
  playlist: SongInfo[];
  currentIndex: number;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  repeatMode: "none" | "all" | "one";
  isShuffled: boolean;

  // 派生状态
  currentSong: () => SongInfo | undefined;

  // Actions
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrev: () => void;

  setPlaylist: (songs: SongInfo[], playIndex?: number) => void;
  playSongNow: (song: SongInfo) => void;

  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;

  setVolume: (volume: number) => void;
  toggleMute: () => void;

  toggleRepeat: () => void;
  toggleShuffle: () => void;
}

// 创建 Zustand Store
export const usePlayerStore = create<PlayerStore>()(
  persist(
    (set, get) => ({
      // 初始状态
      playlist: [],
      currentIndex: -1,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      volume: 0.8,
      isMuted: false,
      repeatMode: "none",
      isShuffled: false,

      // --- 派生状态 ---
      currentSong: () => {
        const { playlist, currentIndex } = get();
        return playlist[currentIndex];
      },

      // --- 基础播放控制 ---
      play: () => set({ isPlaying: true }),
      pause: () => set({ isPlaying: false }),
      togglePlay: () => {
        const { playlist, isPlaying } = get();
        if (playlist.length > 0) {
          set({ isPlaying: !isPlaying });
        }
      },

      // --- 核心播放逻辑 ---
      playSongNow: (song) => {
        set((state) => {
          const existingIndex = state.playlist.findIndex(
            (s) => s.id === song.id
          );
          if (existingIndex !== -1) {
            // 如果歌曲已在该列表，直接切换到该歌曲
            return {
              currentIndex: existingIndex,
              isPlaying: true,
              currentTime: 0,
            };
          } else {
            // 新歌
            const newPlaylist = [
              ...state.playlist.slice(0, state.currentIndex + 1),
              song,
              ...state.playlist.slice(state.currentIndex + 1),
            ];
            return {
              playlist: newPlaylist,
              currentIndex: state.currentIndex + 1,
              isPlaying: true,
              currentTime: 0,
            };
          }
        });
      },

      setPlaylist: (songs, playIndex = 0) => {
        set({
          playlist: songs,
          currentIndex: playIndex,
          isPlaying: songs.length > 0,
          currentTime: 0,
        });
      },

      // --- 歌曲切换 ---
      playNext: () => {
        const { playlist, currentIndex, repeatMode, isShuffled } = get();
        if (playlist.length === 0) return;

        if (repeatMode === "one") {
          set({ currentTime: 0, isPlaying: true });
          return;
        }

        if (isShuffled) {
          const nextIndex = Math.floor(Math.random() * playlist.length);
          set({ currentIndex: nextIndex, currentTime: 0, isPlaying: true });
          return;
        }

        const nextIndex = currentIndex + 1;
        if (nextIndex < playlist.length) {
          set({ currentIndex: nextIndex, currentTime: 0, isPlaying: true });
        } else if (repeatMode === "all") {
          set({ currentIndex: 0, currentTime: 0, isPlaying: true });
        }
      },
      playPrev: () => {
        const { playlist, currentIndex } = get();
        if (playlist.length === 0) return;

        const prevIndex = currentIndex - 1;
        if (prevIndex >= 0) {
          set({ currentIndex: prevIndex, currentTime: 0, isPlaying: true });
        }
      },

      // --- 播放器设置 ---
      setCurrentTime: (time) => set({ currentTime: time }),
      setDuration: (duration) => set({ duration }),

      setVolume: (volume) => {
        const newVolume = Math.max(0, Math.min(1, volume));
        set({ volume: newVolume, isMuted: newVolume === 0 });
      },

      toggleMute: () => {
        set((state) => ({ isMuted: !state.isMuted }));
      },

      toggleRepeat: () => {
        set((state) => {
          const modes: ("none" | "one" | "all")[] = ["none", "all", "one"];
          const currentModeIndex = modes.indexOf(state.repeatMode);
          const nextMode = modes[(currentModeIndex + 1) % modes.length];
          return { repeatMode: nextMode };
        });
      },

      toggleShuffle: () => {
        set((state) => ({ isShuffled: !state.isShuffled }));
      },
    }),
    {
      name: "mmusic-player-storage", // 持久化存储键名
      partialize: (state) => ({
        volume: state.volume,
        isMuted: state.isMuted,
        repeatMode: state.repeatMode,
        isShuffled: state.isShuffled,
      }),
    }
  )
);
