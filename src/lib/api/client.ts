import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosRequestConfig,
} from "axios";
import { useAuthStore } from "@/store/useAuthStore";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: ApiError;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

function isPublicAuthRequest(config: AxiosRequestConfig | undefined): boolean {
  const url = config?.url ?? "";
  if (typeof url !== "string") return false;
  return [
    "/supplier-portal/auth/login",
    "/supplier-portal/auth/validate-otp",
    "/supplier-portal/auth/resend-otp",
    "/supplier-portal/auth/set-password",
    "/supplier-portal/auth/refresh",
    "/supplier-portal/auth/logout",
  ].some((path) => url.includes(path));
}

function isRefreshRequest(config: AxiosRequestConfig | undefined): boolean {
  const url = config?.url ?? "";
  return typeof url === "string" && url.includes("/supplier-portal/auth/refresh");
}

let isRefreshing = false;
const failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: AxiosError) => void;
}> = [];

function processQueue(err: AxiosError | null, token: string | null) {
  failedQueue.forEach((prom) => {
    if (err) prom.reject(err);
    else if (token) prom.resolve(token);
  });
  failedQueue.length = 0;
}

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    if (!originalRequest) {
      useAuthStore.getState().logout();
      return Promise.reject(error);
    }

    if (
      isPublicAuthRequest(originalRequest) ||
      isRefreshRequest(originalRequest) ||
      (originalRequest as AxiosRequestConfig & { _retry?: boolean })._retry
    ) {
      if (isPublicAuthRequest(originalRequest)) {
        return Promise.reject(error);
      }
      useAuthStore.getState().logout();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({
          resolve: (token: string) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            resolve(token);
          },
          reject,
        });
      })
        .then((token) =>
          api.request({
            ...originalRequest,
            headers: {
              ...originalRequest.headers,
              Authorization: `Bearer ${token}`,
            },
          })
        )
        .catch((e) => Promise.reject(e));
    }

    (originalRequest as AxiosRequestConfig & { _retry?: boolean })._retry =
      true;
    isRefreshing = true;

    try {
      const { authService } = await import("@/services/auth.service");
      const result = await authService.refresh();
      if (result.error || !result.data?.accessToken) {
        processQueue(error, null);
        useAuthStore.getState().logout();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }

      const newToken = result.data.accessToken;
      useAuthStore.getState().setToken(newToken);
      processQueue(null, newToken);

      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
      }
      return api.request(originalRequest);
    } finally {
      isRefreshing = false;
    }
  }
);

export async function get<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await api.get<T>(url, config);
  return response.data;
}

export async function post<T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await api.post<T>(url, data, config);
  return response.data;
}

export async function put<T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await api.put<T>(url, data, config);
  return response.data;
}

export async function patch<T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await api.patch<T>(url, data, config);
  return response.data;
}

export async function del<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await api.delete<T>(url, config);
  return response.data;
}

export const apiClient = { get, post, put, patch, delete: del };
export { api };

export const handleApiError = (error: unknown): ApiError => {
  if (error && typeof error === "object" && "message" in error) {
    return error as ApiError;
  }
  return { message: "Error desconocido" };
};

export const isApiError = (error: unknown): error is ApiError => {
  return error !== null && typeof error === "object" && "message" in error;
};

export const getErrorMessage = (error: unknown): string => {
  if (isApiError(error)) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Ha ocurrido un error inesperado";
};

