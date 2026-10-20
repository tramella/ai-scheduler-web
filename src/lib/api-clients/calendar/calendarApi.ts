import { API_BASE_URL } from "../apiBaseUrl";

export async function fetchCalendarScheduleApi(params?: { weekOffset?: number; location_id?: string }): Promise<{ success: boolean; data: any }> {
  const token = typeof window !== "undefined" ? localStorage.getItem("orbit_auth_token") : null;
  const activeCompany = typeof window !== "undefined" ? localStorage.getItem("orbit_active_company") : null;
  const companyId = activeCompany ? JSON.parse(activeCompany).id : null;

  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (companyId) headers["x-company-id"] = companyId;

  const query = new URLSearchParams();
  if (typeof params?.weekOffset === "number") query.append("weekOffset", String(params.weekOffset));
  if (params?.location_id) query.append("location_id", params.location_id);

  const qStr = query.toString() ? `?${query.toString()}` : "";
  const response = await fetch(`${API_BASE_URL}/api/dashboard/calendar${qStr}`, { headers });
  const data = await response.json();
  if (!response.ok || !data.success) throw new Error(data.error || "Failed to fetch calendar schedule");
  return data;
}
