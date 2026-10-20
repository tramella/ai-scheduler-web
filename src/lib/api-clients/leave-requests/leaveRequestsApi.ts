import { API_BASE_URL } from "../apiBaseUrl";

// ---------------- Leave Requests API ----------------
export async function fetchLeaveRequestsApi(): Promise<{ success: boolean; data: any[] }> {
  const token = typeof window !== "undefined" ? localStorage.getItem("orbit_auth_token") : null;
  const activeCompany = typeof window !== "undefined" ? localStorage.getItem("orbit_active_company") : null;
  const companyId = activeCompany ? JSON.parse(activeCompany).id : null;

  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (companyId) headers["x-company-id"] = companyId;

  const response = await fetch(`${API_BASE_URL}/api/leave-requests`, { headers });
  const data = await response.json();
  if (!response.ok || !data.success) throw new Error(data.error || "Failed to fetch leave requests");
  return data;
}

export async function updateLeaveRequestStatusApi(id: string, status: "APPROVED" | "REJECTED" | "PENDING"): Promise<{ success: boolean; data: any }> {
  const token = typeof window !== "undefined" ? localStorage.getItem("orbit_auth_token") : null;
  const activeCompany = typeof window !== "undefined" ? localStorage.getItem("orbit_active_company") : null;
  const companyId = activeCompany ? JSON.parse(activeCompany).id : null;

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (companyId) headers["x-company-id"] = companyId;

  const response = await fetch(`${API_BASE_URL}/api/leave-requests/${id}/status`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ status })
  });
  const data = await response.json();
  if (!response.ok || !data.success) throw new Error(data.error || "Failed to update leave request status");
  return data;
}
