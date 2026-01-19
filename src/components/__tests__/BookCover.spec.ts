import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import BookCover from "@/components/BookCover.vue";

describe("BookCover.vue", () => {
  it("zeigt Badge, Titel, Hinweis-Punkte und Spine an", () => {
    const wrapper = mount(BookCover);

    // Container vorhanden (sicher prüfen mit find().exists())
    expect(wrapper.find(".cover").exists()).toBe(true);

    // Badge vorhanden und korrekt
    const badge = wrapper.get(".badge");
    expect(badge.text()).toBe("Mein Freundebuch");

    // Titel vorhanden und korrekt
    const h1 = wrapper.get("h1");
    expect(h1.text()).toBe("⋆˚꩜｡Mein Freundebuch⋆˚꩜｡");

    // Hinweis-Punkte (.dot) vorhanden (3 Stück)
    const hint = wrapper.get(".hint");
    const dots = hint.findAll(".dot");
    expect(dots.length).toBe(3);

    // Spine sollte vorhanden sein und aria-hidden="true" haben
    const spine = wrapper.get(".spine");
    expect(spine.attributes("aria-hidden")).toBe("true");
  });
});
