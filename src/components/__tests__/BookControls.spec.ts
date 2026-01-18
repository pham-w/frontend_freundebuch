import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import BookControls from "@/components/BookControls.vue";

describe("BookControls.vue", () => {
  it("deaktiviert und aktiviert  Zurück/Weiter-Buttons", async () => {
    const wrapper = mount(BookControls, {
      props: { hasPrev: false, hasNext: true },
    });

    const left = wrapper.get("button.left");
    const right = wrapper.get("button.right");

    expect(left.attributes("disabled")).toBeDefined();
    expect(right.attributes("disabled")).toBeUndefined();

    await right.trigger("click");
    expect(wrapper.emitted()).toHaveProperty("next");

    await left.trigger("click");
    expect(wrapper.emitted()).not.toHaveProperty("prev");

    const wrapper2 = mount(BookControls, { props: { hasPrev: true, hasNext: true } });
    const left2 = wrapper2.get("button.left");
    await left2.trigger("click");
    expect(wrapper2.emitted()).toHaveProperty("prev");
  });
});

