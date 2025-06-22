import { create } from "zustand";
import type { NeteaseResultType } from "@/types/NeteaseTypes";

interface SearchResultState {
  neteaseResults: NeteaseResultType | null;
  setNeteaseResults: (results: NeteaseResultType | null) => void;
  keyword: string;
  setKeyword: (kw: string) => void;
}

export const useSearchResultStore = create<SearchResultState>((set) => ({
  neteaseResults: null,
  setNeteaseResults: (results) => set({ neteaseResults: results }),
  keyword: "",
  setKeyword: (kw) => set({ keyword: kw }),
}));
