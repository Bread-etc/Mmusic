import { create } from "zustand";
import type { NeteaseResultType } from "@/types/NeteaseTypes";
import type { KugouResultType } from "@/types/KugouTypes";

interface SearchResultState {
  neteaseResults: NeteaseResultType | null;
  kugouResults: KugouResultType | null;
  setNeteaseResults: (results: NeteaseResultType | null) => void;
  setKugouResults: (results: KugouResultType | null) => void;
}

export const useSearchResultStore = create<SearchResultState>((set) => ({
  neteaseResults: null,
  kugouResults: null,
  setNeteaseResults: (results) => set({ neteaseResults: results }),
  setKugouResults: (results) => set({ kugouResults: results }),
}));