import { describe, it, expect, beforeEach, vi } from "vitest";
import * as authApi from "@/services/authApi";

describe("authApi", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("login good path", async () => {
    const fakeUser = { id: 1, email: "a@b.de", name: "A" };
    const mockFetch = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve(fakeUser) }));
    vi.stubGlobal("fetch", mockFetch as any);

    const res = await authApi.login("a@b.de", "pw");
    expect(res).toEqual(fakeUser);
    expect(mockFetch).toHaveBeenCalled();
  });

  it("login bad path - zeigt eine Nachricht an bei JSON error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({ ok: false, json: () => Promise.resolve({ message: "bad credentials" }) })
      ) as any
    );

    await expect(authApi.login("a@b.de", "wrong")).rejects.toThrow("bad credentials");
  });
});
