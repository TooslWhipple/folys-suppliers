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
  /** Correo del proveedor que ya pasó el login y espera validar su OTP. */
  pendingEmail: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setAuth: (token: string, user: SupplierUser) => void;
  setPendingEmail: (email: string | null) => void;
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
      pendingEmail: null,
      isLoading: false,
      isAuthenticated: false,

      setAuth: (token: string, user: SupplierUser) => {
        set({
          token,
          user,
          pendingEmail: null,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      setPendingEmail: (pendingEmail: string | null) => set({ pendingEmail }),

      setToken: (token: string) => {
        set({ token, isAuthenticated: true });
      },

      logout: () => {
        set({
          token: null,
          user: null,
          pendingEmail: null,
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
        pendingEmail: state.pendingEmail,
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
