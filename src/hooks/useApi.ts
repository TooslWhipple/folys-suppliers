"use client";

import { useState, useCallback } from "react";
import { useNotification } from "@/contexts/NotificationContext";
import { getErrorMessage, ApiError } from "@/lib/api/client";

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: ApiError) => void;
  showSuccessNotification?: boolean;
  successMessage?: string;
  showErrorNotification?: boolean;
}

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
}

export function useApi<T>() {
  const { showSuccess, showError } = useNotification();

  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (
      apiCall: () => Promise<T>,
      options: UseApiOptions<T> = {}
    ): Promise<T | null> => {
      const {
        onSuccess,
        onError,
        showSuccessNotification = false,
        successMessage = "Operación exitosa",
        showErrorNotification = true,
      } = options;

      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const result = await apiCall();

        setState({
          data: result,
          loading: false,
          error: null,
        });

        if (showSuccessNotification) {
          showSuccess(successMessage);
        }

        onSuccess?.(result);
        return result;
      } catch (error) {
        const apiError: ApiError = {
          message: getErrorMessage(error),
          status: (error as ApiError)?.status,
          code: (error as ApiError)?.code,
        };

        setState({
          data: null,
          loading: false,
          error: apiError,
        });

        if (showErrorNotification) {
          showError(apiError.message);
        }

        onError?.(apiError);
        return null;
      }
    },
    [showSuccess, showError]
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

export function useApiCall<T>(apiCall: () => Promise<T>, options: UseApiOptions<T> = {}) {
  const { showSuccess, showError } = useNotification();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const execute = useCallback(async (): Promise<T | null> => {
    const {
      onSuccess,
      onError,
      showSuccessNotification = false,
      successMessage = "Operación exitosa",
      showErrorNotification = true,
    } = options;

    setLoading(true);
    setError(null);

    try {
      const result = await apiCall();

      if (showSuccessNotification) {
        showSuccess(successMessage);
      }

      onSuccess?.(result);
      return result;
    } catch (err) {
      const apiError: ApiError = {
        message: getErrorMessage(err),
        status: (err as ApiError)?.status,
        code: (err as ApiError)?.code,
      };

      setError(apiError);

      if (showErrorNotification) {
        showError(apiError.message);
      }

      onError?.(apiError);
      return null;
    } finally {
      setLoading(false);
    }
  }, [apiCall, options, showSuccess, showError]);

  return {
    execute,
    loading,
    error,
  };
}

export default useApi;
