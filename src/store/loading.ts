import { create } from "zustand";

interface LoadingState {
  loading: boolean;
  setLoading: (v: boolean) => void;
}

export const useLoadingStore = create<LoadingState>((set) => ({
  loading: false,
  setLoading: (v) => set({ loading: v }),
}));
