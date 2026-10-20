import { API_BASE_URL } from "../apiBaseUrl";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone_number?: string;
  avatar_url?: string;
  account_type: "PERSONAL" | "BUSINESS";
  platform_role?: "SUPER_ADMIN" | "USER";
  is_verified: boolean;
  is_active: boolean;
  created_at?: string;
}

export interface CompanyItem {
  id: string;
  code: string;
  name: string;
  role: "COMPANY_ADMIN" | "STORE_MANAGER" | "MANAGER" | "STAFF";
  is_default: boolean;
  tax_code?: string;
  logo_url?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: UserProfile;
  company?: CompanyItem | null;
  companies?: CompanyItem[];
  active_company?: CompanyItem | null;
  verification_code?: string;
  email_preview_url?: string;
  is_verified?: boolean;
  error?: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  full_name: string;
  phone_number?: string;
  account_type: "PERSONAL" | "BUSINESS";
  company_name?: string;
  company_code?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface VerifyEmailPayload {
  email: string;
  code: string;
}

export interface ResendVerificationPayload {
  email: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  email: string;
  code: string;
  new_password: string;
}

/**
 * Handle API JSON response safely
 */
async function handleResponse<T>(res: Response): Promise<T> {
  let data: Record<string, unknown> = {};
  try {
    data = (await res.json()) as Record<string, unknown>;
  } catch {
    data = { error: `Server error (${res.status}): ${res.statusText}` };
  }

  if (!res.ok) {
    const errorMsg =
      (typeof data.error === "string" ? data.error : null) ||
      (typeof data.message === "string" ? data.message : null) ||
      `Request failed with status ${res.status}`;
    const error = new Error(errorMsg) as Error & { status?: number; data?: Record<string, unknown> };
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data as unknown as T;
}

/**
 * Register a new user
 */
export async function registerApi(payload: RegisterPayload): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<AuthResponse>(res);
}

/**
 * Log in existing user
 */
export async function loginApi(payload: LoginPayload): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<AuthResponse>(res);
}

/**
 * Verify account using 6-digit OTP
 */
export async function verifyEmailApi(payload: VerifyEmailPayload): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE_URL}/api/auth/verify-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<AuthResponse>(res);
}

/**
 * Resend verification OTP
 */
export async function resendVerificationApi(payload: ResendVerificationPayload): Promise<{ success: boolean; message: string; email_preview_url?: string }> {
  const res = await fetch(`${API_BASE_URL}/api/auth/resend-verification`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<{ success: boolean; message: string; email_preview_url?: string }>(res);
}

/**
 * Get current user profile and companies with JWT Bearer
 */
export async function getMeApi(token: string): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse<AuthResponse>(res);
}

/**
 * Switch default active company
 */
export async function switchCompanyApi(companyId: string, token: string): Promise<{ success: boolean; active_company: CompanyItem }> {
  const res = await fetch(`${API_BASE_URL}/api/auth/companies/switch`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ company_id: companyId }),
  });
  return handleResponse<{ success: boolean; active_company: CompanyItem }>(res);
}

/**
 * Forgot password request
 */
export async function forgotPasswordApi(payload: ForgotPasswordPayload): Promise<{ success: boolean; message: string; email_preview_url?: string }> {
  const res = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<{ success: boolean; message: string; email_preview_url?: string }>(res);
}

/**
 * Reset password using OTP
 */
export async function resetPasswordApi(payload: ResetPasswordPayload): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<{ success: boolean; message: string }>(res);
}

export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
}

/**
 * Change password for authenticated user
 */
export async function changePasswordApi(
  payload: ChangePasswordPayload,
  token: string
): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_BASE_URL}/api/auth/change-password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  return handleResponse<{ success: boolean; message: string }>(res);
}
