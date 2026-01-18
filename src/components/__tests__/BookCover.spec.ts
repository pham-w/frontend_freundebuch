import { mount } from "@vue/test-utils";
import BookCover from "../BookCover.vue";

describe("BookCover.vue", () => {
  it("zeigt Titel, Badge und den Hint (Dots) an", () => {
    const wrapper = mount(BookCover);

    // Titel vorhanden
    expect(wrapper.text()).toContain("Mein Freundebuch");

    // Badge vorhanden
    expect(wrapper.find(".badge").exists()).toBe(true);
    expect(wrapper.find(".badge").text()).toContain("Mein Freundebuch");

    // Hint-Dots vorhanden (3 Stück)
    expect(wrapper.findAll(".dot")).toHaveLength(3);

    // Optional: Spine vorhanden
    expect(wrapper.find(".spine").exists()).toBe(true);
  });
});
