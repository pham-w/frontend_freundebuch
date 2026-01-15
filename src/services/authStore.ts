import { ref, computed } from "vue";

export type AuthUser = { id: number; email: string; name: string };

const KEY = "auth_user";

function loadUser(): AuthUser | null {
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

const userRef = ref<AuthUser | null>(loadUser());

export const authUser = computed(() => userRef.value);

export function setAuthUser(user: AuthUser) {
  userRef.value = user;
  localStorage.setItem(KEY, JSON.stringify(user));
}

export function logout() {
  userRef.value = null;
  localStorage.removeItem(KEY);
}

export function isLoggedIn() {
  return userRef.value !== null;
}
