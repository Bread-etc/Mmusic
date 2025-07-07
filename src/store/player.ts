import { NeteaseSongItem } from "@/types/NeteaseTypes";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PlayerStore {
  // 播放列表
  playlist: NeteaseSongItem[];
  currentIndex: number;
  isPlaying: boolean;

  // 播放模式
  repeatMode: "none" | "all" | "one";
  shuffleMode: boolean;

  // 音量控制
  volume: number;
  isMuted: boolean;

  // 播放状态
  currentTime: number;
  duration: number;

  // Actions
  setPlaylist: (songs: NeteaseSongItem[]) => void;
  setCurrentIndex: (index: number) => void;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrev: () => void;

  // 播放模式控制
  toggleRepeat: () => void;
  toggleShuffle: () => void;

  // 音量控制
  setVolume: (volume: number) => void;
  toggleMute: () => void;

  // 时间控制
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;

  // 播放列表操作
  addToPlaylist: (song: NeteaseSongItem) => void;
  removeFromPlaylist: (index: number) => void;
  clearPlaylist: () => void;

  // 获取下一首、上一首歌曲索引
  getNextIndex: () => number;
  getPrevIndex: () => number;
}

export const usePlayerStore = create<PlayerStore>()(
  persist(
    (set, get) => ({
      // 初始状态
      playlist: [],
      currentIndex: 0,
      isPlaying: false,
      repeatMode: "none",
      shuffleMode: false,
      volume: 1,
      isMuted: false,
      currentTime: 0,
      duration: 0,

      // 设置播放列表
      setPlaylist: (songs) => {
        set({
          playlist: songs,
          currentIndex: 0,
        });
      },

      // 设置当前播放索引
      setCurrentIndex: (index) => {
        const { playlist } = get();
        if (index >= 0 && index < playlist.length) {
          set({ currentIndex: index });
        }
      },

      // 播放
      play: () => {
        set({ isPlaying: true });
      },

      // 暂停
      pause: () => {
        set({ isPlaying: false });
      },

      // 切换播放/暂停
      togglePlay: () => {
        set((state) => ({ isPlaying: !state.isPlaying }));
      },

      // 下一首
      playNext: () => {
        const { getNextIndex } = get();
        const nextIndex = getNextIndex();
        set({ currentIndex: nextIndex, isPlaying: true });
      },

      // 上一首
      playPrev: () => {
        const { getPrevIndex } = get();
        const prevIndex = getPrevIndex();
        set({ currentIndex: prevIndex, isPlaying: true });
      },

      // 切换重复模式
      toggleRepeat: () => {
        set((state) => {
          const modes: ("none" | "all" | "one")[] = ["none", "all", "one"];
          const currentModeIndex = modes.indexOf(state.repeatMode);
          const nextMode = modes[(currentModeIndex + 1) % modes.length];
          return { repeatMode: nextMode };
        });
      },

      // 切换随机播放
      toggleShuffle: () => {
        set((state) => ({ shuffleMode: !state.shuffleMode }));
      },

      // 设置音量
      setVolume: (volume) => {
        const clampedVolume = Math.max(0, Math.min(1, volume));
        set({ volume: clampedVolume, isMuted: clampedVolume === 0 });
      },

      // 切换静音
      toggleMute: () => {
        set((state) => ({ isMuted: !state.isMuted }));
      },

      // 设置当前播放时间
      setCurrentTime: (time) => {
        set({ currentTime: time });
      },

      // 设置歌曲总时长
      setDuration: (duration) => {
        set({ duration: duration });
      },

      // 添加到播放列表
      addToPlaylist: (song) => {
        set((state) => ({
          playlist: [...state.playlist, song],
        }));
      },

      // 从播放列表移除
      removeFromPlaylist: (index) => {
        set((state) => {
          const newPlaylist = state.playlist.filter((_, i) => i !== index);
          let newCurrentIndex = state.currentIndex;

          if (index < state.currentIndex) {
            newCurrentIndex = state.currentIndex - 1;
          } else if (index === state.currentIndex) {
            newCurrentIndex = Math.min(
              state.currentIndex,
              newPlaylist.length - 1
            );
          }

          return {
            playlist: newPlaylist,
            currentIndex: Math.max(0, newCurrentIndex),
          };
        });
      },

      // 清空播放列表
      clearPlaylist: () => {
        set({
          playlist: [],
          currentIndex: 0,
          isPlaying: false,
          currentTime: 0,
          duration: 0,
        });
      },

      // 获取下一首歌曲索引
      getNextIndex: () => {
        const { playlist, currentIndex, repeatMode, shuffleMode } = get();

        if (playlist.length === 0) return 0;

        if (repeatMode === "one") return currentIndex;

        if (shuffleMode) {
          // 随机播放逻辑
          let nextIndex;
          do {
            nextIndex = Math.floor(Math.random() * playlist.length);
          } while (nextIndex === currentIndex && playlist.length > 1);
          return nextIndex;
        }

        // 顺序播放
        if (currentIndex < playlist.length - 1) {
          return currentIndex + 1;
        } else {
          return repeatMode === "all" ? 0 : currentIndex;
        }
      },

      // 获取上一首歌曲索引
      getPrevIndex: () => {
        const { playlist, currentIndex, repeatMode, shuffleMode } = get();

        if (playlist.length === 0) return 0;

        if (repeatMode === "one") {
          return currentIndex;
        }

        if (shuffleMode) {
          // 随机播放逻辑
          let prevIndex;
          do {
            prevIndex = Math.floor(Math.random() * playlist.length);
          } while (prevIndex === currentIndex && playlist.length > 1);
          return prevIndex;
        }

        // 顺序播放
        if (currentIndex > 0) {
          return currentIndex - 1;
        } else {
          return repeatMode === "all" ? playlist.length - 1 : currentIndex;
        }
      },
    }),
    {
      name: "player-store",
      // 只持久化部分状态
      partialize: (state) => ({
        repeatMode: state.repeatMode,
        shuffleMode: state.shuffleMode,
        volume: state.volume,
        isMuted: state.isMuted,
      }),
    }
  )
);
