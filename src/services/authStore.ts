import { ref, computed } from "vue";
import type { AuthUser } from "./authApi";

const userRef = ref<AuthUser | null>(loadUser());

function loadUser(): AuthUser | null {
  const raw = localStorage.getItem("auth_user");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export const authUser = computed(() => userRef.value);

export function setAuthUser(user: AuthUser) {
  userRef.value = user;
  localStorage.setItem("auth_user", JSON.stringify(user));
}

export function logout() {
  userRef.value = null;
  localStorage.removeItem("auth_user");
}

export function isLoggedIn() {
  return userRef.value !== null;
}
