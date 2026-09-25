"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, type AuthState } from "@/store/useAuthStore";
import { authService } from "@/services/auth.service";
import { getErrorMessage, getErrorStatus } from "@/lib/api/client";

/** Error de un flujo de auth: el mensaje del back y el código con el que vino. */
export interface AuthError {
  message: string;
  status: number | null;
}

/** El disparo del OTP falló del lado del servidor (Contrato: 502). */
export const OTP_DELIVERY_FAILED_STATUS = 502;
/** Se agotaron los intentos del OTP vigente (Contrato: 429). */
export const OTP_TOO_MANY_ATTEMPTS_STATUS = 429;

export function useSupplierAuth() {
  const router = useRouter();
  const setAuth = useAuthStore((state: AuthState) => state.setAuth);
  const contextLogout = useAuthStore((state: AuthState) => state.logout);
  const isAuthenticated = useAuthStore((state: AuthState) => state.isAuthenticated);
  const supplier = useAuthStore((state: AuthState) => state.user);
  const pendingEmail = useAuthStore((state: AuthState) => state.pendingEmail);
  const setPendingEmail = useAuthStore((state: AuthState) => state.setPendingEmail);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const captureError = useCallback((err: unknown) => {
    setError({ message: getErrorMessage(err), status: getErrorStatus(err) });
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      setError(null);
      try {
        await authService.login(email, password);
        setPendingEmail(email);
        router.push("/login/validate-otp");
      } catch (err) {
        captureError(err);
      } finally {
        setIsLoading(false);
      }
    },
    [captureError, router, setPendingEmail],
  );

  const validateOtp = useCallback(
    async (otp: string) => {
      if (!pendingEmail) {
        setError({
          message: "Vuelve a iniciar sesión para recibir un código nuevo.",
          status: null,
        });
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const res = await authService.validateOtp(otp, pendingEmail);
        setAuth(res.accessToken, res.supplier);
        router.push("/");
      } catch (err) {
        captureError(err);
      } finally {
        setIsLoading(false);
      }
    },
    [captureError, pendingEmail, router, setAuth],
  );

  const setPassword = useCallback(
    async (token: string, password: string) => {
      setIsLoading(true);
      setError(null);
      try {
        await authService.setPassword(token, password);
        router.push("/login");
      } catch (err) {
        captureError(err);
      } finally {
        setIsLoading(false);
      }
    },
    [captureError, router],
  );

  const logout = useCallback(async () => {
    await authService.logout();
    contextLogout();
    router.push("/login");
  }, [contextLogout, router]);

  return {
    isAuthenticated,
    supplier,
    pendingEmail,
    isLoading,
    error,
    clearError,
    login,
    validateOtp,
    setPassword,
    logout,
  };
}
