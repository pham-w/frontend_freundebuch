import { describe, it, beforeEach, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import Eintrag from "@/components/Eintrag.vue";
import { setAuthUser, logout } from "@/services/authStore";
import { nextTick } from "vue";

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
  logout();
});

describe("Eintrag.vue", () => {
  it("berechnet das Alter", async () => {
    const wrapper = mount(Eintrag);

    const dateInput = wrapper.find('input[type="date"]');
    await dateInput.setValue("1990-06-15");

    function calcAge(birthDate: string | null | undefined): number {
      if (!birthDate) return 0;
      const birth = new Date(birthDate);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
      return age;
    }

    const expected = calcAge("1990-06-15");

    const ageInput = wrapper.find('input[type="number"]');
    expect(Number((ageInput.element as HTMLInputElement).value)).toBe(expected);
  });

  it("speichert ein neuen Eintrag und erstellt es", async () => {
    setAuthUser({ id: 5, email: "x@x.de", name: "X" });

    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({ ok: true, json: () => Promise.resolve({ id: 123 }) })
      ) as any
    );

    const wrapper = mount(Eintrag);

    await wrapper.find('input[type="text"]').setValue("Muster");
    await wrapper.find('input[type="date"]').setValue("2000-01-01");

    await wrapper.find('form').trigger('submit.prevent');

    await new Promise((r) => setTimeout(r, 0));
    await nextTick();

    expect(wrapper.html()).toContain("✅ Gespeichert!");

    expect(wrapper.emitted()).toHaveProperty("created");

    expect(fetch).toHaveBeenCalled();
  });
});
