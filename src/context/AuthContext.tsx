"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import {
  UserProfile,
  CompanyItem,
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  VerifyEmailPayload,
  loginApi,
  registerApi,
  verifyEmailApi,
  resendVerificationApi,
  getMeApi,
  switchCompanyApi,
} from "@/lib/api-clients/auth/authApi";

export type SimulatedRole = "SUPER_ADMIN" | "COMPANY_ADMIN" | "STORE_MANAGER" | "STAFF" | null;

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  companies: CompanyItem[];
  activeCompany: CompanyItem | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  // Role & Permissions
  isSuperAdmin: boolean;
  isCompanyAdmin: boolean;
  isStoreManager: boolean;
  isStaff: boolean;
  simulatedRole: SimulatedRole;
  setSimulatedRole: (role: SimulatedRole) => void;
  // Methods
  login: (payload: LoginPayload) => Promise<AuthResponse>;
  register: (payload: RegisterPayload) => Promise<AuthResponse>;
  verifyEmail: (payload: VerifyEmailPayload) => Promise<AuthResponse>;
  resendVerification: (email: string) => Promise<{ success: boolean; message: string; email_preview_url?: string }>;
  switchCompany: (companyId: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "orbit_auth_token";
const ACTIVE_COMPANY_KEY = "orbit_active_company";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [companies, setCompanies] = useState<CompanyItem[]>([]);
  const [activeCompany, setActiveCompany] = useState<CompanyItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [simulatedRole, setSimulatedRole] = useState<SimulatedRole>(null);

  // Initialize session on mount
  useEffect(() => {
    const savedToken = typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
    if (savedToken) {
      setToken(savedToken);
      getMeApi(savedToken)
        .then((res) => {
          if (res.user) {
            setUser(res.user);
            const userCompanies = res.companies || [];
            setCompanies(userCompanies);

            // Determine active company
            const savedCompanyId = localStorage.getItem(ACTIVE_COMPANY_KEY);
            let active = userCompanies.find((c) => c.id === savedCompanyId);
            if (!active) {
              active = userCompanies.find((c) => c.is_default) || userCompanies[0] || null;
            }
            setActiveCompany(active);
          }
        })
        .catch(() => {
          // Token expired or invalid
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(ACTIVE_COMPANY_KEY);
          setToken(null);
          setUser(null);
          setCompanies([]);
          setActiveCompany(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    if (!token) return;
    try {
      const res = await getMeApi(token);
      if (res.user) {
        setUser(res.user);
        const userCompanies = res.companies || [];
        setCompanies(userCompanies);

        const currentId = activeCompany?.id || localStorage.getItem(ACTIVE_COMPANY_KEY);
        const match = userCompanies.find((c) => c.id === currentId) || userCompanies.find((c) => c.is_default) || userCompanies[0] || null;
        setActiveCompany(match);
      }
    } catch (err) {
      console.error("Failed to refresh user:", err);
    }
  }, [token, activeCompany]);

  const login = async (payload: LoginPayload): Promise<AuthResponse> => {
    const res = await loginApi(payload);
    if (res.token && res.user) {
      localStorage.setItem(TOKEN_KEY, res.token);
      setToken(res.token);
      setUser(res.user);
      const userCompanies = res.companies || [];
      setCompanies(userCompanies);
      const active = res.active_company || userCompanies[0] || null;
      setActiveCompany(active);
      if (active) {
        localStorage.setItem(ACTIVE_COMPANY_KEY, active.id);
      }
    }
    return res;
  };

  const register = async (payload: RegisterPayload): Promise<AuthResponse> => {
    const res = await registerApi(payload);
    return res;
  };

  const verifyEmail = async (payload: VerifyEmailPayload): Promise<AuthResponse> => {
    const res = await verifyEmailApi(payload);
    if (res.token && res.user) {
      localStorage.setItem(TOKEN_KEY, res.token);
      setToken(res.token);
      setUser(res.user);
      const userCompanies = res.companies || [];
      setCompanies(userCompanies);
      const active = res.active_company || userCompanies[0] || null;
      setActiveCompany(active);
      if (active) {
        localStorage.setItem(ACTIVE_COMPANY_KEY, active.id);
      }
    }
    return res;
  };

  const resendVerification = async (email: string) => {
    return await resendVerificationApi({ email });
  };

  const switchCompany = async (companyId: string) => {
    if (!token) return;
    const res = await switchCompanyApi(companyId, token);
    if (res.active_company) {
      setActiveCompany(res.active_company);
      localStorage.setItem(ACTIVE_COMPANY_KEY, res.active_company.id);
      // Update is_default in companies list
      setCompanies((prev) =>
        prev.map((c) => ({
          ...c,
          is_default: c.id === res.active_company.id,
        }))
      );
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ACTIVE_COMPANY_KEY);
    setToken(null);
    setUser(null);
    setCompanies([]);
    setActiveCompany(null);
    setSimulatedRole(null);
  };

  // Determine effective roles based on real backend credentials or simulation override
  const effectivePlatformRole =
    simulatedRole === "SUPER_ADMIN"
      ? "SUPER_ADMIN"
      : user?.platform_role || "USER";

  const effectiveCompanyRole =
    simulatedRole === "SUPER_ADMIN"
      ? "COMPANY_ADMIN"
      : simulatedRole || activeCompany?.role || "COMPANY_ADMIN";

  const isSuperAdmin = effectivePlatformRole === "SUPER_ADMIN";
  const isCompanyAdmin = effectiveCompanyRole === "COMPANY_ADMIN";
  const isStoreManager = effectiveCompanyRole === "STORE_MANAGER" || effectiveCompanyRole === "MANAGER";
  const isStaff = effectiveCompanyRole === "STAFF";

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        companies,
        activeCompany,
        isLoading,
        isAuthenticated: Boolean(token && user),
        isSuperAdmin,
        isCompanyAdmin,
        isStoreManager,
        isStaff,
        simulatedRole,
        setSimulatedRole,
        login,
        register,
        verifyEmail,
        resendVerification,
        switchCompany,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
