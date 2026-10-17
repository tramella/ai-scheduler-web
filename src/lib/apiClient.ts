const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export interface GenerateScheduleParams {
  file?: File;
  start: string;
  end: string;
  prompt?: string;
  provider?: "gemini" | "openai";
}

export interface EmployeeAssignment {
  id?: string;
  employee_id?: string;
  name: string;
  job_title?: string;
  photo?: string;
}

export interface ShiftGroup {
  id: string;
  name: string;
  start: string;
  end: string;
  employees: EmployeeAssignment[];
}

export interface LocationGroup {
  id: string;
  code?: string;
  name: string;
  shifts: ShiftGroup[];
}

export interface DailySchedule {
  date: string;
  locations: LocationGroup[];
}

export interface GenerateScheduleResponse {
  success: boolean;
  meta?: {
    range_start: string;
    range_end: string;
  };
  schedules?: DailySchedule[];
  error?: string;
}

export async function generateSchedule(params: GenerateScheduleParams): Promise<GenerateScheduleResponse> {
  const formData = new FormData();
  if (params.file) {
    formData.append("file", params.file);
  }
  formData.append("start", params.start);
  formData.append("end", params.end);
  if (params.prompt) {
    formData.append("prompt", params.prompt);
  }
  if (params.provider) {
    formData.append("provider", params.provider);
  }

  const response = await fetch(`${API_BASE_URL}/api/schedule/generate`, {
    method: "POST",
    body: formData
  });

  let data: Record<string, unknown> = {};
  try {
    data = (await response.json()) as Record<string, unknown>;
  } catch {
    data = { error: `Server error (${response.status}): ${response.statusText}` };
  }

  if (!response.ok || !data.success) {
    const errorMsg =
      (typeof data.error === "string" ? data.error : null) ||
      (typeof data.message === "string" ? data.message : null) ||
      `Failed to generate schedule (HTTP ${response.status})`;
    throw new Error(errorMsg);
  }

  return data as unknown as GenerateScheduleResponse;
}

export async function exportSchedule(schedules: DailySchedule[]): Promise<Blob> {
  const response = await fetch(`${API_BASE_URL}/api/schedule/export`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ schedules })
  });

  if (!response.ok) {
    throw new Error("Failed to export schedule");
  }

  return await response.blob();
}

/**
 * Save schedule draft to database
 */
export async function saveScheduleDraft(payload: {
  schedules: DailySchedule[];
  start_date?: string;
  end_date?: string;
  location_id?: string;
  name?: string;
}): Promise<{ success: boolean; message?: string; data?: unknown }> {
  const token = typeof window !== "undefined" ? localStorage.getItem("orbit_auth_token") : null;
  const activeCompany = typeof window !== "undefined" ? localStorage.getItem("orbit_active_company") : null;
  const companyId = activeCompany ? JSON.parse(activeCompany).id : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json"
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (companyId) headers["x-company-id"] = companyId;

  const response = await fetch(`${API_BASE_URL}/api/schedule/save-draft`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload)
  });

  const resData = await response.json();
  if (!response.ok || !resData.success) {
    throw new Error(resData.error || "Failed to save schedule draft");
  }
  return resData;
}

/**
 * Employee API integration
 */
export interface BackendEmployee {
  _id: string;
  employee_code: string;
  full_name: string;
  email?: string;
  phone?: string;
  job_title?: string;
  department?: string;
  contract_type?: string;
  employment_type?: string;
  target_hours?: number;
  scheduled_hours?: number;
  location_name?: string;
  skills?: string[];
  status?: string;
  is_active?: boolean;
}

export async function fetchEmployeesApi(params?: {
  search?: string;
  role?: string;
  status?: string;
  page?: number;
  limit?: number;
}): Promise<{ success: boolean; data: BackendEmployee[]; pagination?: { total: number; totalPages: number } }> {
  const token = typeof window !== "undefined" ? localStorage.getItem("orbit_auth_token") : null;
  const activeCompany = typeof window !== "undefined" ? localStorage.getItem("orbit_active_company") : null;
  const companyId = activeCompany ? JSON.parse(activeCompany).id : null;

  const query = new URLSearchParams();
  if (params?.search) query.append("search", params.search);
  if (params?.role && params.role !== "all") query.append("role", params.role);
  if (params?.status && params.status !== "all") query.append("status", params.status);
  if (params?.page) query.append("page", String(params.page));
  if (params?.limit) query.append("limit", String(params.limit));

  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (companyId) headers["x-company-id"] = companyId;

  const response = await fetch(`${API_BASE_URL}/api/employees?${query.toString()}`, {
    method: "GET",
    headers
  });

  const resData = await response.json();
  if (!response.ok || !resData.success) {
    throw new Error(resData.error || "Failed to fetch employees");
  }
  return resData;
}

export async function createEmployeeApi(employeeData: Partial<BackendEmployee>): Promise<{ success: boolean; data: BackendEmployee }> {
  const token = typeof window !== "undefined" ? localStorage.getItem("orbit_auth_token") : null;
  const activeCompany = typeof window !== "undefined" ? localStorage.getItem("orbit_active_company") : null;
  const companyId = activeCompany ? JSON.parse(activeCompany).id : null;

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (companyId) headers["x-company-id"] = companyId;

  const response = await fetch(`${API_BASE_URL}/api/employees`, {
    method: "POST",
    headers,
    body: JSON.stringify(employeeData)
  });

  const resData = await response.json();
  if (!response.ok || !resData.success) {
    throw new Error(resData.error || "Failed to create employee");
  }
  return resData;
}

export async function updateEmployeeApi(id: string, updateData: Partial<BackendEmployee>): Promise<{ success: boolean; data: BackendEmployee }> {
  const token = typeof window !== "undefined" ? localStorage.getItem("orbit_auth_token") : null;
  const activeCompany = typeof window !== "undefined" ? localStorage.getItem("orbit_active_company") : null;
  const companyId = activeCompany ? JSON.parse(activeCompany).id : null;

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (companyId) headers["x-company-id"] = companyId;

  const response = await fetch(`${API_BASE_URL}/api/employees/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(updateData)
  });

  const resData = await response.json();
  if (!response.ok || !resData.success) {
    throw new Error(resData.error || "Failed to update employee");
  }
  return resData;
}

export async function deleteEmployeeApi(id: string): Promise<{ success: boolean }> {
  const token = typeof window !== "undefined" ? localStorage.getItem("orbit_auth_token") : null;
  const activeCompany = typeof window !== "undefined" ? localStorage.getItem("orbit_active_company") : null;
  const companyId = activeCompany ? JSON.parse(activeCompany).id : null;

  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (companyId) headers["x-company-id"] = companyId;

  const response = await fetch(`${API_BASE_URL}/api/employees/${id}`, {
    method: "DELETE",
    headers
  });

  const resData = await response.json();
  if (!response.ok || !resData.success) {
    throw new Error(resData.error || "Failed to delete employee");
  }
  return resData;
}

export async function importEmployeeExcelApi(file: File): Promise<{ success: boolean; message: string; data?: unknown }> {
  const token = typeof window !== "undefined" ? localStorage.getItem("orbit_auth_token") : null;
  const activeCompany = typeof window !== "undefined" ? localStorage.getItem("orbit_active_company") : null;
  const companyId = activeCompany ? JSON.parse(activeCompany).id : null;

  const formData = new FormData();
  formData.append("file", file);

  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (companyId) headers["x-company-id"] = companyId;

  const response = await fetch(`${API_BASE_URL}/api/employees/import-excel`, {
    method: "POST",
    headers,
    body: formData
  });

  const resData = await response.json();
  if (!response.ok || !resData.success) {
    throw new Error(resData.error || "Failed to import employee Excel");
  }
  return resData;
}

// ---------------- Locations API ----------------
export async function fetchLocationsApi(): Promise<{ success: boolean; data: any[] }> {
  const token = typeof window !== "undefined" ? localStorage.getItem("orbit_auth_token") : null;
  const activeCompany = typeof window !== "undefined" ? localStorage.getItem("orbit_active_company") : null;
  const companyId = activeCompany ? JSON.parse(activeCompany).id : null;

  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (companyId) headers["x-company-id"] = companyId;

  const response = await fetch(`${API_BASE_URL}/api/locations`, { headers });
  const data = await response.json();
  if (!response.ok || !data.success) throw new Error(data.error || "Failed to fetch locations");
  return data;
}

export async function createLocationApi(payload: any): Promise<{ success: boolean; data: any }> {
  const token = typeof window !== "undefined" ? localStorage.getItem("orbit_auth_token") : null;
  const activeCompany = typeof window !== "undefined" ? localStorage.getItem("orbit_active_company") : null;
  const companyId = activeCompany ? JSON.parse(activeCompany).id : null;

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (companyId) headers["x-company-id"] = companyId;

  const response = await fetch(`${API_BASE_URL}/api/locations`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload)
  });
  const data = await response.json();
  if (!response.ok || !data.success) throw new Error(data.error || "Failed to create location");
  return data;
}

export async function deleteLocationApi(id: string): Promise<{ success: boolean }> {
  const token = typeof window !== "undefined" ? localStorage.getItem("orbit_auth_token") : null;
  const activeCompany = typeof window !== "undefined" ? localStorage.getItem("orbit_active_company") : null;
  const companyId = activeCompany ? JSON.parse(activeCompany).id : null;

  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (companyId) headers["x-company-id"] = companyId;

  const response = await fetch(`${API_BASE_URL}/api/locations/${id}`, {
    method: "DELETE",
    headers
  });
  const data = await response.json();
  if (!response.ok || !data.success) throw new Error(data.error || "Failed to delete location");
  return data;
}

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

// ---------------- AI Logs API ----------------
export async function fetchAiLogsApi(): Promise<{ success: boolean; data: any[] }> {
  const token = typeof window !== "undefined" ? localStorage.getItem("orbit_auth_token") : null;
  const activeCompany = typeof window !== "undefined" ? localStorage.getItem("orbit_active_company") : null;
  const companyId = activeCompany ? JSON.parse(activeCompany).id : null;

  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (companyId) headers["x-company-id"] = companyId;

  const response = await fetch(`${API_BASE_URL}/api/ai-generation-logs`, { headers });
  const data = await response.json();
  if (!response.ok || !data.success) throw new Error(data.error || "Failed to fetch AI logs");
  return data;
}

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




