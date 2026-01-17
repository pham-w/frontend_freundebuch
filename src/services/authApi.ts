import { API_BASE } from "@/services/api";

export type AuthUser = { id: number; email: string; name: string };

async function extractErrorMessage(res: Response, fallback: string) {
  try {
    const data = await res.json();
    // Spring Boot liefert meist { message: "...", ... }
    return data?.message || fallback;
  } catch {
    const text = await res.text();
    return text || fallback;
  }
}

export async function register(email: string, password: string, name: string): Promise<void> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name }),
  });

  if (!res.ok) {
    const msg = await extractErrorMessage(res, `Registrierung fehlgeschlagen (${res.status})`);
    throw new Error(msg);
  }
}

export async function login(email: string, password: string): Promise<AuthUser> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const msg = await extractErrorMessage(res, `Login fehlgeschlagen (${res.status})`);
    throw new Error(msg);
  }

  return await res.json();
}
