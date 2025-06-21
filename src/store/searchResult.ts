import { create } from "zustand";
import type { SearchResultForNetease } from "@/types/NeteaseTypes";
import { SearchResultForKugou } from "@/types/KugouTypes";

interface SearchState {
  searchResults: SearchResultForNetease | SearchResultForKugou | null;
  setSearchResults: (
    results: SearchResultForNetease | SearchResultForKugou | null
  ) => void;
}

export const useSearchResultStore = create<SearchState>((set) => ({
  searchResults: null,
  setSearchResults: (results) => set({ searchResults: results }),
}));
