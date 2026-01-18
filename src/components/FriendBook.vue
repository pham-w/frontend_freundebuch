<script setup lang="ts">
import { ref, computed, watch } from "vue";
import FriendPage from "./FriendPage.vue";
import BookCover from "./BookCover.vue";
import BookControls from "./BookControls.vue";
import { getFavoriteIds, toggleFavoriteId } from "@/services/favoritesStore";
import { API_BASE } from "@/services/api";
import { authUser } from "@/services/authStore";
import EmptyPage from "./EmptyPage.vue";


const pages = ref<any[]>([]);
const pageIndex = ref(-1);
const loading = ref(true);
const error = ref<string | null>(null);
const props = defineProps<{ showOnlyFavs?: boolean; search?: string; showFilters?: boolean; }>();

const hasAnyEntries = computed(() => pages.value.length > 0);
const hasAnyFiltered = computed(() => filteredPages.value.length > 0);

const emptyMode = computed<"none" | "noEntries" | "noFavorites">(() => {
  if (hasAnyFiltered.value) return "none";

  // Favoriten-Modus an, aber es gibt Einträge -> dann sind nur keine Favoriten da
  if (props.showOnlyFavs && hasAnyEntries.value) return "noFavorites";

  // sonst: wirklich gar keine Einträge (oder nicht eingeloggt etc.)
  return "noEntries";
});

const emit = defineEmits<{
  (e: "update:search", value: string): void;
  (e: "update:showFilters", value: boolean): void;
}>();

const searchName = computed<string>({
  get: () => props.search ?? "",
  set: (v) => emit("update:search", v),
});

const showFilters = computed<boolean>({
  get: () => props.showFilters ?? false,
  set: (v) => emit("update:showFilters", v),
});



// -------------------- FILTER: einzelne Felder --------------------
const selectedMonth = ref<string | null>(null);
const selectedFood = ref<string | null>(null);
const selectedColor = ref<string | null>(null);
const selectedAge = ref<string | null>(null);
const selectedHobby = ref<string | null>(null);
const selectedDreamJob = ref<string | null>(null);

const favoriteIds = ref<number[]>([]);

const favoriteSet = computed(() => new Set(favoriteIds.value));

function refreshFavorites() {
  const uid = authUser.value?.id;
  favoriteIds.value = uid ? getFavoriteIds(uid) : [];
}

function toggleFav(pageId: number) {
  const uid = authUser.value?.id;
  if (!uid) return;
  favoriteIds.value = toggleFavoriteId(uid, pageId);
}


// Ist irgendein Filter oder die Suche aktiv?
const isFilterActive = computed(
  () =>
    !!selectedMonth.value ||
    !!selectedFood.value ||
    !!selectedColor.value ||
    !!selectedAge.value ||
    !!selectedHobby.value ||
    !!selectedDreamJob.value ||
    !!searchName.value.trim()
);

function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean).map((v) => v.trim()))).sort(
    (a, b) => a.localeCompare(b, "de")
  );
}

// Alter aus Geburtsdatum berechnen
function calcAgeFromDate(d: string | null | undefined): string | null {
  if (!d) return null;
  const birth = new Date(d);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return String(age);
}

const monthNames: Record<string, string> = {
  "01": "Januar",
  "02": "Februar",
  "03": "März",
  "04": "April",
  "05": "Mai",
  "06": "Juni",
  "07": "Juli",
  "08": "August",
  "09": "September",
  "10": "Oktober",
  "11": "November",
  "12": "Dezember",
};

const monthOptions = computed(() => {
  const months = pages.value
    .map((p) => {
      if (!p.geburtsdatum) return null;
      const s = String(p.geburtsdatum);
      if (s.length < 7) return null;
      return s.slice(5, 7); // MM
    })
    .filter((m) => !!m) as string[];

  return unique(months).map((m) => ({
    value: m,
    label: monthNames[m] ?? m,
  }));
});

const foodOptions = computed(() => unique(pages.value.map((p) => p.favFood)));
const colorOptions = computed(() => unique(pages.value.map((p) => p.favColor)));
const ageOptions = computed(() =>
  unique(
    pages.value
      .map((p) => calcAgeFromDate(p.geburtsdatum))
      .filter((x): x is string => !!x)
  )
);
const hobbyOptions = computed(() => unique(pages.value.map((p) => p.hobby)));
const dreamJobOptions = computed(() => unique(pages.value.map((p) => p.dreamJob)));

// Kombinierter Filter + Namenssuche
const filteredPages = computed(() => {
  return pages.value.filter((p) => {
    //Favoriten
    if (props.showOnlyFavs && !favoriteSet.value.has(p.id)) return false;
    // Geburtsmonat
    if (selectedMonth.value) {
      if (!p.geburtsdatum) return false;
      const s = String(p.geburtsdatum);
      if (s.length < 7) return false;
      const month = s.slice(5, 7);
      if (month !== selectedMonth.value) return false;
    }

    // Lieblingsessen
    if (selectedFood.value && p.favFood !== selectedFood.value) return false;

    // Lieblingsfarbe
    if (selectedColor.value && p.favColor !== selectedColor.value) return false;

    // Alter (berechnet)
    if (selectedAge.value) {
      const a = calcAgeFromDate(p.geburtsdatum);
      if (a !== selectedAge.value) return false;
    }

    // Hobby
    if (selectedHobby.value && p.hobby !== selectedHobby.value) return false;

    // Traumberuf
    if (selectedDreamJob.value && p.dreamJob !== selectedDreamJob.value)
      return false;

    // 🔍 Namenssuche (case-insensitive, enthält)
    const q = searchName.value.trim().toLowerCase();
    if (q) {
      const name = (p.name ?? "").toLowerCase();
      if (!name.includes(q)) return false;
    }

    return true;
  });
});

// Wenn Filter/Suche sich ändern → im Buchmodus wieder zum Cover
watch(
  [
    selectedMonth,
    selectedFood,
    selectedColor,
    selectedAge,
    selectedHobby,
    selectedDreamJob,
    searchName,
  ],
  () => {
    pageIndex.value = -1;
  }
);

function resetFilter() {
  selectedMonth.value = null;
  selectedFood.value = null;
  selectedColor.value = null;
  selectedAge.value = null;
  selectedHobby.value = null;
  selectedDreamJob.value = null;
  emit("update:search", "");
}

// -------------------- DATA LOAD (AUTH) --------------------
async function loadPages() {
  loading.value = true;
  error.value = null;

  try {
    const uid = authUser.value?.id;
    if (!uid) {
      pages.value = [];
      pageIndex.value = -1;
      refreshFavorites();
      return;
    }

    const res = await fetch(`${API_BASE}/seite?userId=${uid}`);
    if (!res.ok) throw new Error("HTTP " + res.status);

    const data = await res.json();
    pages.value = data.sort((a: any, b: any) => a.id - b.id);
    refreshFavorites();
    pageIndex.value = pages.value.length > 0 ? -1 : -1;
  } catch (e: any) {
    error.value = e?.message ?? String(e);
  } finally {
    loading.value = false;
  }
}

// bei Login/Logout neu laden
watch(
  authUser,
  () => {
    pageIndex.value = -1;
    refreshFavorites();
    loadPages();
  },
  { immediate: true }
);

function next() {
  // Cover -> Empty page
  if (filteredPages.value.length === 0) {
    if (pageIndex.value < 0) pageIndex.value = 0;
    return;
  }

  if (pageIndex.value < 0) { pageIndex.value = 0; return; }
  if (pageIndex.value < filteredPages.value.length - 1) pageIndex.value++;
}

function prev() {
  if (pageIndex.value >= 0) pageIndex.value--;
}

// -------------------- DELETE (AUTH) --------------------
async function deleteEntry(id: number) {
  const confirmed = window.confirm("Willst du diesen Eintrag wirklich löschen?");
  if (!confirmed) return;

  const uid = authUser.value?.id;
  if (!uid) {
    window.alert("Nicht eingeloggt.");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/seite/${id}?userId=${uid}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`HTTP ${res.status}: ${text}`);
    }

    pages.value = pages.value.filter((p) => p.id !== id);

    if (!isFilterActive.value) {
      if (filteredPages.value.length === 0) {
        pageIndex.value = -1;
      } else if (pageIndex.value >= filteredPages.value.length) {
        pageIndex.value = filteredPages.value.length - 1;
      }
    } else {
      if (pageIndex.value >= filteredPages.value.length) {
        pageIndex.value = filteredPages.value.length - 1;
      }
    }
  } catch (e: any) {
    window.alert("Löschen fehlgeschlagen: " + (e?.message ?? e));
  }
}
</script>

<template>
  <div class="shell">
    <!-- Filter-Overlay (schiebt nichts) -->
    <aside v-if="showFilters" class="filters">
      <div class="filter-bar">
        <div class="filter-row">
          <label>
            Geburtsmonat:
            <select v-model="selectedMonth">
              <option :value="null">Alle Monate</option>
              <option v-for="m in monthOptions" :key="m.value" :value="m.value">
                {{ m.label }}
              </option>
            </select>
          </label>

          <label>
            Alter:
            <select v-model="selectedAge">
              <option :value="null">Alle Alter</option>
              <option v-for="a in ageOptions" :key="a" :value="a">{{ a }}</option>
            </select>
          </label>

          <label>
            Lieblingsessen:
            <select v-model="selectedFood">
              <option :value="null">Alle Essen</option>
              <option v-for="f in foodOptions" :key="f" :value="f">{{ f }}</option>
            </select>
          </label>

          <label>
            Lieblingsfarbe:
            <select v-model="selectedColor">
              <option :value="null">Alle Farben</option>
              <option v-for="c in colorOptions" :key="c" :value="c">{{ c }}</option>
            </select>
          </label>

          <label>
            Hobby:
            <select v-model="selectedHobby">
              <option :value="null">Alle Hobbys</option>
              <option v-for="h in hobbyOptions" :key="h" :value="h">{{ h }}</option>
            </select>
          </label>

          <label>
            Traumberuf:
            <select v-model="selectedDreamJob">
              <option :value="null">Alle Traumberufe</option>
              <option v-for="d in dreamJobOptions" :key="d" :value="d">{{ d }}</option>
            </select>
          </label>

          <button class="btn btn-dark" type="button" @click="resetFilter()">
            Filter zurücksetzen
          </button>
        </div>
      </div>
    </aside>


    <!-- Zentrum: Buch bleibt IMMER mittig -->
    <main class="stage">
      <p v-if="loading" class="empty">Lädt…</p>
      <p v-else-if="error" class="empty">Fehler: {{ error }}</p>

      <template v-else>
        <div class="book">
          <template v-if="!isFilterActive">
            <div class="book-frame">
              <BookControls
                :hasPrev="pageIndex >= 0"
                :hasNext="pageIndex < 0 || pageIndex < filteredPages.length - 1"
                @prev="prev"
                @next="next"
              />

              <BookCover v-if="pageIndex < 0" class="sheet" />

              <EmptyPage
                v-else-if="emptyMode !== 'none'"
                class="sheet"
                :title="emptyMode === 'noFavorites' ? 'Keine Favoriten' : 'Sie haben noch keine Einträge'"
                :message="emptyMode === 'noFavorites'
    ? 'Du hast noch keine Favoriten markiert.'
    : 'Du hast noch keine Einträge erstellt.'"
                :hint="emptyMode === 'noFavorites'
    ? 'Tippe bei einem Eintrag auf ☆, um ihn zu den Favoriten hinzuzufügen.'
    : 'Klicke oben auf „Neuer Eintrag“, um deinen ersten Eintrag zu erstellen.'"
              />

              <FriendPage
                v-else
                class="sheet"
                :person="filteredPages[pageIndex]"
                :visible="true"
                :isFavorite="favoriteSet.has(filteredPages[pageIndex].id)"
                @toggle-favorite="toggleFav(filteredPages[pageIndex].id)"
                @deleted="deleteEntry"
              />
            </div>
          </template>
        </div>
      </template>
    </main>
  </div>
</template>




<style scoped>

/* Grundfläche */
.shell {
  position: relative;
  width: 100%;
}

/* Zentrum: Buch bleibt IMMER mittig */
.stage {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 24px 20px 40px;
}

.book {
  width: min(1200px, 96vw);
}

.book-frame {
  position: relative;
  width: min(860px, 92vw);
  margin: 24px auto 0;
  display: flex;
  justify-content: center;
  align-items: stretch;
  height: 320px;
}

.sheet {
  width: 100%;
}


/* Filter Overlay */
.filters {
  position: fixed;
  left: 24px;
  top: 140px; /* unter Topbar */
  z-index: 50;
  width: 240px;
}

.filter-bar {
  width: 100%;
  opacity: 0.9;
  padding: 14px;
  border-radius: 16px;
  background: linear-gradient(180deg, #0f172a 0%, #020617 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.55);
}

.filter-row {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.filter-row label {
  color: #e5e7eb;
  font-size: 0.8rem;
  font-weight: 500;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.filter-row select {
  height: 36px;
  border-radius: 10px;
  background: #020617;
  color: #e5e7eb;
  border: 1px solid rgba(255, 255, 255, 0.14);
  padding: 0 10px;
  cursor: pointer;
}

.filter-row select:focus {
  outline: none;
  border-color: #2563eb;
}

/* Buttons (einheitlich) */
.btn {
  height: 40px;
  padding: 0 14px;
  border-radius: 12px;
  border: none;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.btn-dark {
  background: #111827;
  color: #ffffff;
}

.btn-dark:hover {
  opacity: 0.92;
}

.filter-row .btn {
  margin-top: 8px;
}

.empty {
  opacity: 0.7;
}

.empty-sheet h2 {
  margin: 0 0 8px;
}

.empty-sheet p {
  margin: 0;
  opacity: 0.8;
  max-width: 46ch;
}

</style>
