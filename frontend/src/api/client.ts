// frontend/src/api/client.ts

export const API_URL =
  import.meta.env.VITE_API_URL?.replace(/\/+$/, "") || "http://localhost:8000";

type HttpOptions = RequestInit & {
  json?: unknown; // если передаём тело как JSON
};

async function http<T>(path: string, options: HttpOptions = {}): Promise<T> {
  const url = `${API_URL}${path}`;
  const headers = new Headers(options.headers);
  if (options.json !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(url, {
    ...options,
    headers,
    body: options.json !== undefined ? JSON.stringify(options.json) : options.body,
  });

  // Попробуем распарсить JSON даже при ошибках, чтобы показать детали
  let data: any = null;
  const text = await res.text();
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text || null;
  }

  if (!res.ok) {
    const message =
      (data && (data.detail || data.message)) ||
      `HTTP ${res.status} ${res.statusText}`;
    // Пробрасываем объект ошибки с полезными полями
    const err = new Error(message) as Error & { status?: number; data?: any };
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data as T;
}

/* ====== Типы соответствуют нашим Pydantic-схемам ====== */
export type Vendor = {
  id: number;
  name: string;
  contact_email: string;
  category: string;
  rating: number; // 1..5
};

export type VendorCreate = {
  name: string;
  contact_email: string;
  category: string;
  rating: number; // 1..5
};

export type VendorUpdate = Partial<VendorCreate>;

/* ====== Конкретные вызовы API ====== */
export function apiListVendors() {
  return http<Vendor[]>("/api/vendors");
}

export function apiCreateVendor(payload: VendorCreate) {
  return http<Vendor>("/api/vendors", { method: "POST", json: payload });
}

export function apiUpdateVendor(id: number, payload: VendorUpdate) {
  return http<Vendor>(`/api/vendors/${id}`, { method: "PUT", json: payload });
}
