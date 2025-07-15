import { create } from "zustand";
import type { NeteaseSearchResult } from "@/types/NeteaseTypes";

interface SearchResultState {
  neteaseResults: NeteaseSearchResult | null;
  setNeteaseResults: (results: NeteaseSearchResult | null) => void;
  keyword: string;
  setKeyword: (kw: string) => void;
}

export const useSearchResultStore = create<SearchResultState>((set) => ({
  neteaseResults: null,
  setNeteaseResults: (results) => set({ neteaseResults: results }),
  keyword: "",
  setKeyword: (kw) => set({ keyword: kw }),
}));
