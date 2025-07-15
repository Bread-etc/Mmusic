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

export type PlaybackMode = "list" | "single" | "shuffle";

interface PlayerStore {
  playlist: SongInfo[];
  shuffledPlaylist: SongInfo[];
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

// 洗牌算法 (Fisher-Yates shuffle)
const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const usePlayerStore = create<PlayerStore>()(
  persist(
    (set, get) => ({
      playlist: [],
      shuffledPlaylist: [],
      currentIndex: -1,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      volume: 0.8,
      isMuted: false,
      likedSongs: [],
      playbackMode: "list",

      currentSong: () => {
        const { playlist, shuffledPlaylist, currentIndex, playbackMode } =
          get();
        const currentPlaylist =
          playbackMode === "shuffle" ? shuffledPlaylist : playlist;
        return currentPlaylist[currentIndex];
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
          const currentPlaylist =
            state.playbackMode === "shuffle"
              ? state.shuffledPlaylist
              : state.playlist;
          const existingIndex = currentPlaylist.findIndex(
            (s) => s.id === song.id
          );

          if (existingIndex !== -1) {
            return {
              currentIndex: existingIndex,
              isPlaying: true,
              currentTime: 0,
            };
          } else {
            const newPlaylist = [...state.playlist, song];
            const newShuffledPlaylist = shuffleArray(newPlaylist);
            return {
              playlist: newPlaylist,
              shuffledPlaylist: newShuffledPlaylist,
              currentIndex:
                state.playbackMode === "shuffle"
                  ? newShuffledPlaylist.findIndex((s) => s.id === song.id)
                  : newPlaylist.length - 1,
              isPlaying: true,
              currentTime: 0,
            };
          }
        });
      },

      setPlaylist: (songs, playIndex = 0) => {
        // 利用 Map 的特性根据歌曲ID进行去重
        const uniqueSongs = Array.from(
          new Map(songs.map((song) => [song.id, song])).values()
        );

        const newShuffledPlaylist = shuffleArray(uniqueSongs);
        set({
          playlist: uniqueSongs,
          shuffledPlaylist: newShuffledPlaylist,
          currentIndex: playIndex,
          isPlaying: uniqueSongs.length > 0,
          currentTime: 0,
        });
      },

      playNext: () => {
        const { playlist, shuffledPlaylist, currentIndex, playbackMode } =
          get();
        const currentPlaylist =
          playbackMode === "shuffle" ? shuffledPlaylist : playlist;
        if (currentPlaylist.length === 0) return;

        if (playbackMode === "single") {
          set({ currentTime: 0, isPlaying: true });
          return;
        }

        const nextIndex = (currentIndex + 1) % currentPlaylist.length;
        set({ currentIndex: nextIndex, currentTime: 0, isPlaying: true });
      },

      playPrev: () => {
        const { playlist, shuffledPlaylist, currentIndex, playbackMode } =
          get();
        const currentPlaylist =
          playbackMode === "shuffle" ? shuffledPlaylist : playlist;
        if (currentPlaylist.length === 0) return;

        const prevIndex = currentIndex - 1;
        if (prevIndex >= 0) {
          set({ currentIndex: prevIndex, currentTime: 0, isPlaying: true });
        } else {
          // 如果是第一首，则循环到列表的最后一首
          set({
            currentIndex: currentPlaylist.length - 1,
            currentTime: 0,
            isPlaying: true,
          });
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

          if (nextMode === "shuffle") {
            const shuffled = shuffleArray(state.playlist);
            // 切换到随机模式时，保持当前歌曲仍在播放
            const currentSongId = state.playlist[state.currentIndex]?.id;
            const newIndex = shuffled.findIndex((s) => s.id === currentSongId);
            return {
              playbackMode: nextMode,
              shuffledPlaylist: shuffled,
              currentIndex: newIndex >= 0 ? newIndex : 0,
            };
          } else {
            // 从随机模式切回时，恢复正确的索引
            if (state.playbackMode === "shuffle") {
              const currentSongId =
                state.shuffledPlaylist[state.currentIndex]?.id;
              const newIndex = state.playlist.findIndex(
                (s) => s.id === currentSongId
              );
              return {
                playbackMode: nextMode,
                shuffledPlaylist: [],
                currentIndex: newIndex >= 0 ? newIndex : 0,
              };
            }
            return { playbackMode: nextMode, shuffledPlaylist: [] };
          }
        });
      },

      toggleLike: () => {
        const song = get().currentSong();
        if (!song) return;
        set((state) => {
          const isLiked = state.likedSongs.some((s) => s.id === song.id);
          if (isLiked) {
            return {
              likedSongs: state.likedSongs.filter((s) => s.id !== song.id),
            };
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
