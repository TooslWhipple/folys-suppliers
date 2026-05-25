"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { flushSync } from "react-dom";
import type { SupplierInfo } from "@/services/auth.service";

const TOKEN_KEY = "supplier_token";
const SUPPLIER_KEY = "supplier_info";

interface AuthContextType {
  token: string | null;
  supplier: SupplierInfo | null;
  isAuthenticated: boolean;
  setAuth: (token: string, supplier: SupplierInfo) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
  });
  const [supplier, setSupplier] = useState<SupplierInfo | null>(() => {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(SUPPLIER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as SupplierInfo;
    } catch {
      localStorage.removeItem(SUPPLIER_KEY);
      return null;
    }
  });
  const setAuth = useCallback((newToken: string, newSupplier: SupplierInfo) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(SUPPLIER_KEY, JSON.stringify(newSupplier));
    flushSync(() => {
      setToken(newToken);
      setSupplier(newSupplier);
    });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(SUPPLIER_KEY);
    setToken(null);
    setSupplier(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        supplier,
        isAuthenticated: !!token,
        setAuth,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used inside AuthProvider");
  return ctx;
}
