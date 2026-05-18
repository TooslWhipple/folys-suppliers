"use client";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { theme } from "@/lib/theme";
import { NotificationProvider } from "@/contexts/NotificationContext";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <title>FolySoft - Portal de Proveedores</title>
        <meta name="description" content="Portal de proveedores Foly" />
      </head>
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
