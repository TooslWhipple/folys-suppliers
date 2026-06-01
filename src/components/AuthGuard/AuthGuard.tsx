"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { CircularProgress } from "@mui/material";
import { useRouter, usePathname } from "next/navigation";
import { authService } from "@/services/auth.service";
import { useAuthStore, type AuthState } from "@/store/useAuthStore";

interface AuthGuardProps {
  children: React.ReactNode;
}

interface AuthPersistApi {
  hasHydrated: () => boolean;
  onFinishHydration: (callback: () => void) => () => void;
}

function getAuthPersistApi(): AuthPersistApi | null {
  const storeWithPersist = useAuthStore as typeof useAuthStore & {
    persist?: AuthPersistApi;
  };
  return storeWithPersist.persist ?? null;
}

function subscribeToAuthHydration(callback: () => void): () => void {
  return getAuthPersistApi()?.onFinishHydration(callback) ?? (() => undefined);
}

function getAuthHydrationSnapshot(): boolean {
  return getAuthPersistApi()?.hasHydrated() ?? true;
}

function getServerHydrationSnapshot(): boolean {
  return false;
}

const PUBLIC_ROUTES = ["/login", "/login/validate-otp", "/set-password"];

function isPublicRoute(path: string): boolean {
  return PUBLIC_ROUTES.some((route) => path === route || path.startsWith(`${route}?`));
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const token = useAuthStore((state: AuthState) => state.token);
  const user = useAuthStore((state: AuthState) => state.user);
  const setUser = useAuthStore((state: AuthState) => state.setUser);
  const clearAuth = useAuthStore((state: AuthState) => state.logout);

  const hasHydrated = useSyncExternalStore(
    subscribeToAuthHydration,
    getAuthHydrationSnapshot,
    getServerHydrationSnapshot
  );

  const [validatedToken, setValidatedToken] = useState<string | null>(null);

  useEffect(() => {
    if (!hasHydrated) return;

    const publicRoute = isPublicRoute(pathname);

    if (!token) {
      if (!publicRoute) {
        clearAuth();
        router.replace("/login");
      }
      return;
    }

    if (validatedToken === token && user) {
      if (publicRoute || pathname === "/") {
        router.replace("/");
      }
      return;
    }

    let cancelled = false;

    async function validateSession() {
      const result = await authService.me();

      if (cancelled) return;

      if (result.error || !result.data) {
        clearAuth();
        setValidatedToken(null);
        if (!publicRoute) {
          router.replace("/login");
        }
        return;
      }

      const nextUser = result.data;
      setUser(nextUser);
      setValidatedToken(token);

      if (publicRoute || pathname === "/") {
        router.replace("/");
      }
    }

    void validateSession();

    return () => {
      cancelled = true;
    };
  }, [clearAuth, hasHydrated, pathname, router, setUser, token, user, validatedToken]);

  if (!hasHydrated) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CircularProgress />
      </div>
    );
  }

  const publicRoute = isPublicRoute(pathname);

  if (publicRoute && !token) {
    return <>{children}</>;
  }

  const isLoading = !token || !user || validatedToken !== token || (token && publicRoute);

  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CircularProgress />
      </div>
    );
  }

  return <>{children}</>;
}
