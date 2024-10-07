import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, Store } from "@/components/interface/authStore-interface";

const createState = (set: any) => {
  const persistedState =
    typeof window !== "undefined" && window.localStorage
      ? JSON.parse(localStorage.getItem("auth-storage") || "{}")
      : {};

  return {
    accessToken: persistedState.accessToken || "",
    refreshToken: persistedState.refreshToken || "",
    isAuthenticated: persistedState.isAuthenticated || false,
    user: persistedState.user || undefined,
    setAuthDetail: (accessToken: string, refreshToken: string) => {
      set(() => ({
        accessToken,
        refreshToken,
        isAuthenticated: true,
        user: undefined,
      }));

      localStorage.setItem(
        "auth-storage",
        JSON.stringify({ accessToken, refreshToken, isAuthenticated: true })
      );
    },
    deleteAuthDetail: () => {
      set(() => ({
        accessToken: "",
        refreshToken: "",
        isAuthenticated: false,
        user: undefined,
      }));
      localStorage.removeItem("auth-storage");
    },
    setUser: (user: User | undefined) => {
      set((state: Store) => ({
        ...state,
        user,
      }));
    },
  };
};

const useStore = create(persist(createState, { name: "auth-storage" }));

export default useStore;