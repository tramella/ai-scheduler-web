import { API_BASE_URL } from "../apiBaseUrl";

// ---------------- Dashboard & Analytics API ----------------
export async function fetchDashboardSummaryApi(): Promise<{ success: boolean; data: any }> {
  const token = typeof window !== "undefined" ? localStorage.getItem("orbit_auth_token") : null;
  const activeCompany = typeof window !== "undefined" ? localStorage.getItem("orbit_active_company") : null;
  const companyId = activeCompany ? JSON.parse(activeCompany).id : null;

  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (companyId) headers["x-company-id"] = companyId;

  const response = await fetch(`${API_BASE_URL}/api/dashboard/summary`, { headers });
  const data = await response.json();
  if (!response.ok || !data.success) throw new Error(data.error || "Failed to fetch dashboard summary");
  return data;
}

export async function fetchDashboardAnalyticsApi(period?: string): Promise<{ success: boolean; data: any }> {
  const token = typeof window !== "undefined" ? localStorage.getItem("orbit_auth_token") : null;
  const activeCompany = typeof window !== "undefined" ? localStorage.getItem("orbit_active_company") : null;
  const companyId = activeCompany ? JSON.parse(activeCompany).id : null;

  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (companyId) headers["x-company-id"] = companyId;

  const query = period ? `?period=${encodeURIComponent(period)}` : "";
  const response = await fetch(`${API_BASE_URL}/api/dashboard/analytics${query}`, { headers });
  const data = await response.json();
  if (!response.ok || !data.success) throw new Error(data.error || "Failed to fetch dashboard analytics");
  return data;
}
