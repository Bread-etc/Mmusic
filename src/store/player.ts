import { NeteaseSongItem } from "@/types/NeteaseTypes";
import { create } from "zustand";

interface PlayerState {
  playlist: NeteaseSongItem[];
  currentIndex: number;
  isPlaying: boolean;
  setPlaylist: (list: NeteaseSongItem[], startIndex?: number) => void;
  play: (index?: number) => void;
  pause: () => void;
  playNext: () => void;
  playPrev: () => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  playlist: [],
  currentIndex: 0,
  isPlaying: false,
  setPlaylist: (list, startIndex = 0) =>
    set({ playlist: list, currentIndex: startIndex, isPlaying: true }),
  play: (index) =>
    set((state) => ({
      isPlaying: true,
      currentIndex: index !== undefined ? index : state.currentIndex,
    })),
  pause: () => set({ isPlaying: false }),
  playNext: () => {
    const { playlist, currentIndex } = get();
    if (currentIndex < playlist.length - 1) {
      set({ currentIndex: currentIndex + 1, isPlaying: true });
    }
  },
  playPrev: () => {
    const { currentIndex } = get();
    if (currentIndex > 0) {
      set({ currentIndex: currentIndex - 1, isPlaying: true });
    }
  },
}));
