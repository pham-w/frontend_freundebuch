import { beforeEach, describe, it, expect } from "vitest";
import { getFavoriteIds, toggleFavoriteId } from "@/services/favoritesStore";

const keyForUser = (id: number) => `friendbook_favorites_v1_user_${id}`;

describe("favoritesStore", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("gibt ein leeres Array zurück, wenn keine Favoriten vorhanden sind", () => {
    expect(getFavoriteIds(1)).toEqual([]);
  });

  it("fügt einen Lieblingseintrag hinzu und entfernt es wieder", () => {
    const res1 = toggleFavoriteId(1, 42);
    expect(res1).toEqual([42]);
    expect(JSON.parse(localStorage.getItem(keyForUser(1))!)).toEqual([42]);

    const res2 = toggleFavoriteId(1, 42);
    expect(res2).toEqual([]);
    expect(JSON.parse(localStorage.getItem(keyForUser(1))!)).toEqual([]);
  });

  it("favoriteEintrag bad path - bei ungültigem JSON wird es nicht als Favorit gespeichert", () => {
    localStorage.setItem(keyForUser(1), "not-json");
    expect(getFavoriteIds(1)).toEqual([]);
  });
});

