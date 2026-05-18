"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { Snackbar, Alert, AlertColor } from "@mui/material";

export interface NotificationOptions {
  message: string;
  severity?: AlertColor;
  duration?: number;
  autoHide?: boolean;
}

interface NotificationContextType {
  showNotification: (options: NotificationOptions) => void;
  showSuccess: (message: string, duration?: number) => void;
  showError: (message: string, duration?: number) => void;
  showWarning: (message: string, duration?: number) => void;
  showInfo: (message: string, duration?: number) => void;
  closeNotification: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<AlertColor>("info");
  const [duration, setDuration] = useState(6000);

  const showNotification = useCallback((options: NotificationOptions) => {
    setMessage(options.message);
    setSeverity(options.severity || "info");
    setDuration(options.duration || 6000);
    setOpen(true);
  }, []);

  const showSuccess = useCallback((message: string, duration = 6000) => {
    showNotification({ message, severity: "success", duration });
  }, [showNotification]);

  const showError = useCallback((message: string, duration = 6000) => {
    showNotification({ message, severity: "error", duration });
  }, [showNotification]);

  const showWarning = useCallback((message: string, duration = 6000) => {
    showNotification({ message, severity: "warning", duration });
  }, [showNotification]);

  const showInfo = useCallback((message: string, duration = 6000) => {
    showNotification({ message, severity: "info", duration });
  }, [showNotification]);

  const closeNotification = useCallback(() => {
    setOpen(false);
  }, []);

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    closeNotification();
  };

  const value: NotificationContextType = {
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    closeNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={duration}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleClose}
          severity={severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
}

export function useNotification(): NotificationContextType {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
}

export default NotificationContext;
