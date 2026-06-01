import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface SupplierUser {
  supplierId: number;
  email: string;
  name: string;
}

export interface AuthState {
  token: string | null;
  user: SupplierUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setAuth: (token: string, user: SupplierUser) => void;
  setToken: (token: string) => void;
  logout: () => void;
  setUser: (user: SupplierUser) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isLoading: false,
      isAuthenticated: false,

      setAuth: (token: string, user: SupplierUser) => {
        set({
          token,
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      setToken: (token: string) => {
        set({ token, isAuthenticated: true });
      },

      logout: () => {
        set({
          token: null,
          user: null,
          isAuthenticated: false,
        });
      },

      setUser: (user: SupplierUser) => set({ user, isAuthenticated: true }),

      setLoading: (isLoading: boolean) => set({ isLoading }),
    }),
    {
      name: "supplier-auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          state.isAuthenticated = true;
        }
      },
    }
  )
);
