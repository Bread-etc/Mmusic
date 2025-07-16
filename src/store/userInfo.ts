import { NeteaseUserProfile } from "@/types/NeteaseTypes";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserInfoState {
  profile: NeteaseUserProfile | null;
  setProfile: (profile: NeteaseUserProfile) => void;
  clearProfile: () => void;
}

export const useUserInfoStore = create<UserInfoState>()(
  persist(
    (set) => ({
      profile: null,
      setProfile: (profile) => set({ profile }),
      clearProfile: () => set({ profile: null }),
    }),
    {
      name: "mmusic-user-store",
      partialize: (state) => ({
        profile: state.profile,
      }),
    }
  )
);
