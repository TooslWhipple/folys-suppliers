import {
  api,
  type ApiResponse,
  type ApiSuccessResponse,
} from "@/lib/api/client";

export interface SupplierInfo {
  supplierId: number;
  email: string;
  name: string;
}

export interface LoginResponse {
  message: string;
}

export interface ValidateOtpResponse {
  accessToken: string;
  supplier: SupplierInfo;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

export interface SetPasswordResponse {
  message: string;
}

export interface ResendOtpResponse {
  message: string;
}

export interface ApiError {
  message: string;
}

export interface ApiResult<T> {
  data: T | null;
  error: ApiError | null;
}

const AUTH_CREDENTIALS = { withCredentials: true } as const;

function unwrap<T>(response: { data: ApiResponse<T> }): T {
  const r = response.data as ApiSuccessResponse<T>;
  return r.data;
}

function getErrMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  return "Error desconocido";
}

export const authService = {
  login: (email: string, password: string): Promise<LoginResponse> =>
    api
      .post<ApiResponse<LoginResponse>>(
        "/supplier-portal/auth/login",
        { email, password }
      )
      .then(unwrap),

  validateOtp: (otp: string): Promise<ValidateOtpResponse> =>
    api
      .post<ApiResponse<ValidateOtpResponse>>(
        "/supplier-portal/auth/validate-otp",
        { otp },
        AUTH_CREDENTIALS
      )
      .then(unwrap),

  refresh: async (): Promise<ApiResult<RefreshTokenResponse>> => {
    try {
      const data = await api.post<ApiResponse<RefreshTokenResponse>>(
        "/supplier-portal/auth/refresh",
        {},
        AUTH_CREDENTIALS
      );
      return { data: unwrap(data), error: null };
    } catch (err) {
      return {
        data: null,
        error: { message: getErrMessage(err) || "Error al refrescar sesión" },
      };
    }
  },

  logout: async (): Promise<ApiResult<void>> => {
    try {
      await api.post<ApiResponse<void>>(
        "/supplier-portal/auth/logout",
        undefined,
        AUTH_CREDENTIALS
      );
      return { data: null, error: null };
    } catch (err) {
      return {
        data: null,
        error: { message: getErrMessage(err) || "Error al cerrar sesión" },
      };
    }
  },

  me: async (): Promise<ApiResult<SupplierInfo>> => {
    try {
      const data = await api.get<ApiResponse<SupplierInfo>>(
        "/supplier-portal/auth/me"
      );
      return { data: unwrap(data), error: null };
    } catch (err) {
      return {
        data: null,
        error: { message: getErrMessage(err) || "Error al obtener usuario" },
      };
    }
  },

  setPassword: (token: string, password: string): Promise<SetPasswordResponse> =>
    api
      .post<ApiResponse<SetPasswordResponse>>(
        "/supplier-portal/auth/set-password",
        { token, password }
      )
      .then(unwrap),

  resendOtp: (email: string): Promise<ResendOtpResponse> =>
    api
      .post<ApiResponse<ResendOtpResponse>>(
        "/supplier-portal/auth/resend-otp",
        { email }
      )
      .then(unwrap),
};

