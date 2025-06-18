import { create } from "zustand";
import type { SearchResultForNetease } from "@/types/NeteaseTypes";
import { SearchResultForKugou } from "@/types/KugouTypes";
import { SearchResultForBilibili } from "@/types/BilibiliTypes";

interface SearchState {
  searchResults:
    | SearchResultForNetease
    | SearchResultForKugou
    | SearchResultForBilibili
    | null;
  setSearchResults: (
    results:
      | SearchResultForNetease
      | SearchResultForKugou
      | SearchResultForBilibili
      | null
  ) => void;
}

export const useSearchResultStore = create<SearchState>((set) => ({
  searchResults: null,
  setSearchResults: (results) => set({ searchResults: results }),
}));
