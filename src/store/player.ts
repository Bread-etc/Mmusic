import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SongInfo {
  id: string;
  title: string;
  artist: string;
  album: string;
  cover: string;
  url: string;
  duration: number;
  source?: "netease" | "kugou" | "qq" | "bilibili";
  originalData?: any;
}

// 定义播放模式的类型
export type PlaybackMode = "list" | "single" | "shuffle";

interface PlayerStore {
  playlist: SongInfo[];
  currentIndex: number;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  likedSongs: SongInfo[];

  playbackMode: PlaybackMode;

  currentSong: () => SongInfo | undefined;
  isLiked: (songId: string) => boolean;

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

  cyclePlaybackMode: () => void;
  toggleLike: () => void;
}

export const usePlayerStore = create<PlayerStore>()(
  persist(
    (set, get) => ({
      playlist: [],
      currentIndex: -1,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      volume: 0.8,
      isMuted: false,
      likedSongs: [],
      playbackMode: "list", // 默认模式为列表循环

      currentSong: () => {
        const { playlist, currentIndex } = get();
        return playlist[currentIndex];
      },
      isLiked: (songId) => get().likedSongs.some((s) => s.id === songId),

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
          const existingIndex = state.playlist.findIndex((s) => s.id === song.id);
          if (existingIndex !== -1) {
            return { currentIndex: existingIndex, isPlaying: true, currentTime: 0 };
          } else {
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
        set({ playlist: songs, currentIndex: playIndex, isPlaying: songs.length > 0, currentTime: 0 });
      },

      playNext: () => {
        const { playlist, currentIndex, playbackMode } = get();
        if (playlist.length === 0) return;

        if (playbackMode === "single") {
          set({ currentTime: 0, isPlaying: true });
          return;
        }

        if (playbackMode === "shuffle") {
          const nextIndex = Math.floor(Math.random() * playlist.length);
          set({ currentIndex: nextIndex, currentTime: 0, isPlaying: true });
          return;
        }

        // 默认 "list" 模式
        const nextIndex = currentIndex + 1;
        if (nextIndex < playlist.length) {
          set({ currentIndex: nextIndex, currentTime: 0, isPlaying: true });
        } else {
          // 列表循环
          set({ currentIndex: 0, currentTime: 0, isPlaying: true });
        }
      },

      playPrev: () => {
        const { playlist, currentIndex, currentTime } = get();
        if (playlist.length === 0) return;

        if (currentTime > 3) {
          set({ currentTime: 0 });
        } else {
          const prevIndex = currentIndex - 1;
          if (prevIndex >= 0) {
            set({ currentIndex: prevIndex, currentTime: 0, isPlaying: true });
          }
        }
      },

      setCurrentTime: (time) => set({ currentTime: time }),
      setDuration: (duration) => set({ duration }),

      setVolume: (volume) => {
        const newVolume = Math.max(0, Math.min(1, volume));
        set({ volume: newVolume, isMuted: newVolume === 0 });
      },

      toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),

      cyclePlaybackMode: () => {
        set((state) => {
          const modes: PlaybackMode[] = ["list", "single", "shuffle"];
          const currentModeIndex = modes.indexOf(state.playbackMode);
          const nextMode = modes[(currentModeIndex + 1) % modes.length];
          return { playbackMode: nextMode };
        });
      },

      toggleLike: () => {
        const song = get().currentSong();
        if (!song) return;
        set((state) => {
          const isLiked = state.likedSongs.some((s) => s.id === song.id);
          if (isLiked) {
            return { likedSongs: state.likedSongs.filter((s) => s.id !== song.id) };
          } else {
            return { likedSongs: [...state.likedSongs, song] };
          }
        });
      },
    }),
    {
      name: "mmusic-player-storage",
      partialize: (state) => ({
        volume: state.volume,
        isMuted: state.isMuted,
        playbackMode: state.playbackMode,
        likedSongs: state.likedSongs,
      }),
    }
  )
);