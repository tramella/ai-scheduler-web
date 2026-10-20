import { API_BASE_URL } from "../apiBaseUrl";

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
