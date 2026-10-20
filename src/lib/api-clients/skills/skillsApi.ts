import { API_BASE_URL } from "../apiBaseUrl";

// ---------------- Skills API ----------------
export async function fetchSkillsApi(): Promise<{ success: boolean; data: any[] }> {
  const token = typeof window !== "undefined" ? localStorage.getItem("orbit_auth_token") : null;
  const activeCompany = typeof window !== "undefined" ? localStorage.getItem("orbit_active_company") : null;
  const companyId = activeCompany ? JSON.parse(activeCompany).id : null;

  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (companyId) headers["x-company-id"] = companyId;

  const response = await fetch(`${API_BASE_URL}/api/skills`, { headers });
  const data = await response.json();
  if (!response.ok || !data.success) throw new Error(data.error || "Failed to fetch skills");
  return data;
}

export async function createSkillApi(payload: any): Promise<{ success: boolean; data: any }> {
  const token = typeof window !== "undefined" ? localStorage.getItem("orbit_auth_token") : null;
  const activeCompany = typeof window !== "undefined" ? localStorage.getItem("orbit_active_company") : null;
  const companyId = activeCompany ? JSON.parse(activeCompany).id : null;

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (companyId) headers["x-company-id"] = companyId;

  const response = await fetch(`${API_BASE_URL}/api/skills`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload)
  });
  const data = await response.json();
  if (!response.ok || !data.success) throw new Error(data.error || "Failed to create skill");
  return data;
}
