"use client";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { theme } from "@/lib/theme";
import "@/lib/dayjs";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { AuthGuard } from "@/components/AuthGuard/AuthGuard";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es-mx">
        <CssBaseline />
        <NotificationProvider>
          <AuthGuard>{children}</AuthGuard>
        </NotificationProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}
