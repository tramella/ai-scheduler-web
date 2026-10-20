import { API_BASE_URL } from "../apiBaseUrl";

// ---------------- Constraints / Conditions API ----------------
export async function fetchConstraintsApi(): Promise<{ success: boolean; data: any[] }> {
  const token = typeof window !== "undefined" ? localStorage.getItem("orbit_auth_token") : null;
  const activeCompany = typeof window !== "undefined" ? localStorage.getItem("orbit_active_company") : null;
  const companyId = activeCompany ? JSON.parse(activeCompany).id : null;

  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (companyId) headers["x-company-id"] = companyId;

  const response = await fetch(`${API_BASE_URL}/api/constraints`, { headers });
  const data = await response.json();
  if (!response.ok || !data.success) throw new Error(data.error || "Failed to fetch constraints");
  return data;
}

export async function createConstraintApi(payload: any): Promise<{ success: boolean; data: any }> {
  const token = typeof window !== "undefined" ? localStorage.getItem("orbit_auth_token") : null;
  const activeCompany = typeof window !== "undefined" ? localStorage.getItem("orbit_active_company") : null;
  const companyId = activeCompany ? JSON.parse(activeCompany).id : null;

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (companyId) headers["x-company-id"] = companyId;

  const response = await fetch(`${API_BASE_URL}/api/constraints`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload)
  });
  const data = await response.json();
  if (!response.ok || !data.success) throw new Error(data.error || "Failed to create constraint");
  return data;
}

export async function deleteConstraintApi(id: string): Promise<{ success: boolean }> {
  const token = typeof window !== "undefined" ? localStorage.getItem("orbit_auth_token") : null;
  const activeCompany = typeof window !== "undefined" ? localStorage.getItem("orbit_active_company") : null;
  const companyId = activeCompany ? JSON.parse(activeCompany).id : null;

  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (companyId) headers["x-company-id"] = companyId;

  const response = await fetch(`${API_BASE_URL}/api/constraints/${id}`, {
    method: "DELETE",
    headers
  });
  const data = await response.json();
  if (!response.ok || !data.success) throw new Error(data.error || "Failed to delete constraint");
  return data;
}
