import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SongInfo {
  /**
   * 歌曲的唯一标识。
   * @description 为确保跨平台唯一性，建议使用 'platform-songId' 的格式，例如 'netease-123456'。
   */
  id: string;
  /** 歌曲标题 */
  title: string;
  /** 艺术家/歌手名 */
  artist: string;
  /** 专辑名 */
  album: string;
  /** 专辑封面 URL */
  cover: string;
  /** 音频播放 URL */
  url: string;
  /** 歌曲时长（单位：秒） */
  duration: number;
  /** 音乐来源平台 */
  source?: "netease" | "kugou" | "qq" | "bilibili";
  /** 可选，用于存储从API获取的原始数据，方便调试或特殊用途 */
  originalData?: any;
}

/**
 * 定义播放器 Store 的状态和 Actions 接口
 */
interface PlayerStore {
  /** 当前播放列表 */
  playlist: SongInfo[];
  /** 当前播放歌曲在播放列表中的索引 */
  currentIndex: number;
  /** 是否正在播放 */
  isPlaying: boolean;
  /** 当前播放进度（单位：秒） */
  currentTime: number;
  /** 当前歌曲总时长（单位：秒） */
  duration: number;
  /** 音量（0 到 1） */
  volume: number;
  /** 是否静音 */
  isMuted: boolean;
  /** 循环模式: 'none' (不循环), 'all' (列表循环), 'one' (单曲循环) */
  repeatMode: "none" | "all" | "one";
  /** 是否随机播放 */
  isShuffled: boolean;

  /**
   * 获取当前正在播放的歌曲信息。
   * @returns {SongInfo | undefined} 当前歌曲对象，如果播放列表为空则返回 undefined。
   */
  currentSong: () => SongInfo | undefined;

  /** 开始或恢复播放 */
  play: () => void;
  /** 暂停播放 */
  pause: () => void;
  /** 切换播放/暂停状态 */
  togglePlay: () => void;

  /** 播放下一首 */
  playNext: () => void;
  /** 播放上一首 */
  playPrev: () => void;

  /**
   * 设置新的播放列表并立即播放。
   * @param songs 新的歌曲列表
   * @param playIndex 从新列表的哪个索引开始播放，默认为 0
   */
  setPlaylist: (songs: SongInfo[], playIndex?: number) => void;

  /**
   * 立即播放一首指定的歌曲。
   * @description 如果歌曲已在列表中，则跳转到该歌曲；如果不在，则将其插入到当前歌曲之后并播放。
   * @param song 要播放的歌曲
   */
  playSongNow: (song: SongInfo) => void;

  /**
   * 设置当前播放进度。
   * @param time 新的播放进度（秒）
   */
  setCurrentTime: (time: number) => void;
  /**
   * 设置当前歌曲的总时长。
   * @param duration 总时长（秒）
   */
  setDuration: (duration: number) => void;

  /**
   * 设置音量。
   * @param volume 新的音量值（0 到 1）
   */
  setVolume: (volume: number) => void;
  /** 切换静音状态 */
  toggleMute: () => void;

  /** 切换循环模式 */
  toggleRepeat: () => void;
  /** 切换随机播放模式 */
  toggleShuffle: () => void;
}

// 创建 Zustand Store，并使用 persist 中间件进行持久化存储
export const usePlayerStore = create<PlayerStore>()(
  persist(
    (set, get) => ({
      // ------------------
      // 初始状态
      // ------------------
      playlist: [],
      currentIndex: -1,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      volume: 0.8,
      isMuted: false,
      repeatMode: "none",
      isShuffled: false,

      // ------------------
      // 派生状态
      // ------------------
      currentSong: () => {
        const { playlist, currentIndex } = get();
        return playlist[currentIndex];
      },

      // ------------------
      // Actions 实现
      // ------------------
      play: () => set({ isPlaying: true }),
      pause: () => set({ isPlaying: false }),
      togglePlay: () => {
        const { playlist, isPlaying } = get();
        if (playlist.length > 0) {
          set({ isPlaying: !isPlaying });
        }
      },

      playSongNow: (song) => {
        set((state) => {
          const existingIndex = state.playlist.findIndex(
            (s) => s.id === song.id
          );
          if (existingIndex !== -1) {
            // 如果歌曲已在列表中，直接切换到该歌曲
            return {
              currentIndex: existingIndex,
              isPlaying: true,
              currentTime: 0,
            };
          } else {
            // 如果是新歌，则插入到当前播放歌曲的后面
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

      playNext: () => {
        const { playlist, currentIndex, repeatMode, isShuffled } = get();
        if (playlist.length === 0) return;

        // 单曲循环模式
        if (repeatMode === "one") {
          set({ currentTime: 0, isPlaying: true });
          return;
        }

        // 随机播放模式
        if (isShuffled) {
          const nextIndex = Math.floor(Math.random() * playlist.length);
          set({ currentIndex: nextIndex, currentTime: 0, isPlaying: true });
          return;
        }

        // 顺序播放
        const nextIndex = currentIndex + 1;
        if (nextIndex < playlist.length) {
          set({ currentIndex: nextIndex, currentTime: 0, isPlaying: true });
        } else if (repeatMode === "all") {
          // 列表循环
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
          const modes: ("none" | "all" | "one")[] = ["none", "all", "one"];
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
      name: "mmusic-player-storage", // 持久化存储的键名
      // 只持久化用户的偏好设置，不存储播放列表和状态
      partialize: (state) => ({
        volume: state.volume,
        isMuted: state.isMuted,
        repeatMode: state.repeatMode,
        isShuffled: state.isShuffled,
      }),
    }
  )
);
