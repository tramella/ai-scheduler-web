const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export interface GenerateScheduleParams {
  file?: File;
  start: string;
  end: string;
  prompt?: string;
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

  const response = await fetch(`${API_BASE_URL}/api/schedule/generate`, {
    method: "POST",
    body: formData
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.error || "Failed to generate schedule");
  }

  return data;
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
