import { api, type ApiResponse, type ApiSuccessResponse } from "@/lib/api/client";

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

export interface SetPasswordResponse {
  message: string;
}

export interface ResendOtpResponse {
  message: string;
}

export const authService = {
  login: (email: string, password: string): Promise<LoginResponse> =>
    api.post<ApiResponse<LoginResponse>>("/supplier-portal/auth/login", { email, password }).then(r => (r as ApiSuccessResponse<LoginResponse>).data),

  validateOtp: (otp: string): Promise<ValidateOtpResponse> =>
    api.post<ApiResponse<ValidateOtpResponse>>("/supplier-portal/auth/validate-otp", { otp }).then(r => (r as ApiSuccessResponse<ValidateOtpResponse>).data),

  setPassword: (token: string, password: string): Promise<SetPasswordResponse> =>
    api.post<ApiResponse<SetPasswordResponse>>("/supplier-portal/auth/set-password", { token, password }).then(r => (r as ApiSuccessResponse<SetPasswordResponse>).data),

  resendOtp: (email: string): Promise<ResendOtpResponse> =>
    api.post<ApiResponse<ResendOtpResponse>>("/supplier-portal/auth/resend-otp", { email }).then(r => (r as ApiSuccessResponse<ResendOtpResponse>).data),
};
