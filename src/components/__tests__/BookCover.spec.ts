import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import BookCover from "@/components/BookCover.vue";

describe("BookCover.vue", () => {
  it("zeigt den Titel und die Anweisung an", () => {
    const wrapper = mount(BookCover);

    expect(wrapper.text()).toContain("Mein Freundebuch");
    expect(wrapper.text()).toContain("Klicke auf Weiter");
  });
});

