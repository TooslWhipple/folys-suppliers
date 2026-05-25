"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";
import { authService } from "@/services/auth.service";
import { getErrorMessage } from "@/lib/api/client";

export function useSupplierAuth() {
  const router = useRouter();
  const { setAuth, logout: contextLogout, isAuthenticated, supplier } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      setError(null);
      try {
        await authService.login(email, password);
        router.push(`/login/validate-otp?email=${encodeURIComponent(email)}`);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    },
    [router],
  );

  const validateOtp = useCallback(
    async (otp: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await authService.validateOtp(otp);
        setAuth(res.accessToken, res.supplier);
        router.push("/");
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    },
    [router, setAuth],
  );

  const setPassword = useCallback(
    async (token: string, password: string) => {
      setIsLoading(true);
      setError(null);
      try {
        await authService.setPassword(token, password);
        router.push("/login");
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    },
    [router],
  );

  const logout = useCallback(() => {
    contextLogout();
    router.push("/login");
  }, [contextLogout, router]);

  return {
    isAuthenticated,
    supplier,
    isLoading,
    error,
    setError,
    login,
    validateOtp,
    setPassword,
    logout,
  };
}
