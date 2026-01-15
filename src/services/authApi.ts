const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8080";

export type AuthUser = { id: number; email: string; name: string };

export async function register(email: string, password: string, name: string): Promise<void> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Register failed (${res.status})`);
  }
}

export async function login(email: string, password: string): Promise<AuthUser> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Login failed (${res.status})`);
  }

  return await res.json();
}
