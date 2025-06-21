import { SearchResultForKugou } from "@/types/KugouTypes";
import { SearchResultForNetease } from "@/types/NeteaseTypes";
import { create } from "zustand";

interface SearchState {
  searchResults: SearchResultForNetease | SearchResultForKugou | null;
  currentPage: number;
  pageSize: number;
  setSearchResult: (
    results: SearchResultForNetease | SearchResultForKugou | null
  ) => void;
  setCurrentPage: (page: number) => void;
}

export const useSearchPaginationStore = create<SearchState>((set) => ({
  searchResults: null,
  currentPage: 1,
  pageSize: 30,
  setSearchResult: (results) => set({ searchResults: results }),
  setCurrentPage: (page) => set({ currentPage: page }),
}));
