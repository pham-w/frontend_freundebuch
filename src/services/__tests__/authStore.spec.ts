import { beforeEach, describe, it, expect } from "vitest";
import { setAuthUser, authUser, logout, isLoggedIn } from "@/services/authStore";

describe("authStore", () => {
  beforeEach(() => {
    localStorage.clear();
    logout();
  });

  it("speichert den Benutzer und istLoggedIn wird true", () => {
    const user = { id: 1, email: "a@b.de", name: "Anna" };
    setAuthUser(user);

    expect(isLoggedIn()).toBe(true);

    const raw = localStorage.getItem("auth_user");
    expect(raw).not.toBeNull();
    expect(JSON.parse(raw!)).toEqual(user);

    expect(authUser.value).toEqual(user);
  });

  it("logout entfernt den Benutzer und isLoggedIn wird false", () => {
    const user = { id: 2, email: "x@y.de", name: "X" };
    setAuthUser(user);
    expect(isLoggedIn()).toBe(true);

    logout();
    expect(isLoggedIn()).toBe(false);
    expect(localStorage.getItem("auth_user")).toBeNull();
    expect(authUser.value).toBeNull();
  });
});

