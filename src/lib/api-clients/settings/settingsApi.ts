import { API_BASE_URL } from "../apiBaseUrl";

export async function fetchSettingsApi(): Promise<{ success: boolean; data: any }> {
  const token = typeof window !== "undefined" ? localStorage.getItem("orbit_auth_token") : null;
  const activeCompany = typeof window !== "undefined" ? localStorage.getItem("orbit_active_company") : null;
  const companyId = activeCompany ? JSON.parse(activeCompany).id : null;

  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (companyId) headers["x-company-id"] = companyId;

  const response = await fetch(`${API_BASE_URL}/api/dashboard/settings`, { headers });
  const data = await response.json();
  if (!response.ok || !data.success) throw new Error(data.error || "Failed to fetch settings");
  return data;
}

export async function updateSettingsApi(payload: any): Promise<{ success: boolean; message: string; data?: any }> {
  const token = typeof window !== "undefined" ? localStorage.getItem("orbit_auth_token") : null;
  const activeCompany = typeof window !== "undefined" ? localStorage.getItem("orbit_active_company") : null;
  const companyId = activeCompany ? JSON.parse(activeCompany).id : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json"
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (companyId) headers["x-company-id"] = companyId;

  const response = await fetch(`${API_BASE_URL}/api/dashboard/settings`, {
    method: "PUT",
    headers,
    body: JSON.stringify(payload)
  });
  const data = await response.json();
  if (!response.ok || !data.success) throw new Error(data.error || "Failed to update settings");
  return data;
}
