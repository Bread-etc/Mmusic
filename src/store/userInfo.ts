import { create } from "zustand";
import { NeteaseUserInfo } from "@/types/NeteaseTypes";

interface UserInfoState {
  info: NeteaseUserInfo | null;
  setInfo: (info: NeteaseUserInfo) => void;
}

export const useUserInfoStore = create<UserInfoState>((set) => ({
  info: null,
  setInfo: (info) => set({ info }),
}));
