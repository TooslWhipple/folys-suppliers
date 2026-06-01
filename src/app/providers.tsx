"use client";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { theme } from "@/lib/theme";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { AuthGuard } from "@/components/AuthGuard/AuthGuard";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NotificationProvider>
        <AuthGuard>{children}</AuthGuard>
      </NotificationProvider>
    </ThemeProvider>
  );
}
