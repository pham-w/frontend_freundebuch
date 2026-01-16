
import { API_BASE } from "@/services/api";

export type AuthUser = { id: number; email: string; name: string };

export async function register(email: string, password: string, name: string): Promise<void> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name }),
  });
  if (!res.ok) throw new Error((await res.text()) || `Register failed (${res.status})`);
}

export async function login(email: string, password: string): Promise<AuthUser> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error((await res.text()) || `Login failed (${res.status})`);
  return await res.json();
}
