import { create } from "zustand";
import type { SearchResultForNetease } from "@/types/NeteaseTypes";

interface SearchState {
  searchResults: SearchResultForNetease | null;
  setSearchResults: (results: SearchResultForNetease | null) => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  searchResults: null,
  setSearchResults: (results) => set({ searchResults: results }),
}));
