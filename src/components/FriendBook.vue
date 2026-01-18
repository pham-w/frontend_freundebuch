<script setup lang="ts">
import { ref, computed, watch } from "vue";
import FriendPage from "./FriendPage.vue";
import BookCover from "./BookCover.vue";
import BookControls from "./BookControls.vue";
import { getFavoriteIds, toggleFavoriteId } from "@/services/favoritesStore";
import { API_BASE } from "@/services/api";
import { authUser } from "@/services/authStore";

const pages = ref<any[]>([]);
const pageIndex = ref(-1);
const loading = ref(true);
const error = ref<string | null>(null);
const props = defineProps<{ showOnlyFavs?: boolean }>();
const showFilters = ref(false);

// Suchleiste
const searchName = ref("");

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
  searchName.value = "";
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
    pageIndex.value = pages.value.length > 0 ? 0 : -1;
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

// -------------------- BLÄTTERN --------------------
const next = () =>
  pageIndex.value < filteredPages.value.length - 1 && pageIndex.value++;
const prev = () => pageIndex.value >= 0 && pageIndex.value--;

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
  <div class="layout">

    <!-- SIDEBAR LINKS -->
    <div class="sidebar">

      <!-- Suchleiste -->
      <div class="search-wrapper">
        <input
          v-model="searchName"
          type="text"
          placeholder="Nach Freund suchen…"
          class="search-input"
        />

        <button
          v-if="searchName"
          type="button"
          class="search-clear"
          @click="searchName = ''"
          aria-label="Suche löschen"
        >
          ×
        </button>
      </div>

      <!-- Filter Toggle -->
      <button
        class="filter-toggle-btn"
        type="button"
        @click="showFilters = !showFilters"
      >
        {{ showFilters ? "Filter ausblenden" : "Filter anzeigen" }}
      </button>

      <!-- FILTERLEISTE -->
      <div v-if="showFilters" class="filter-bar">
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
              <option v-for="a in ageOptions" :key="a" :value="a">
                {{ a }}
              </option>
            </select>
          </label>

          <label>
            Lieblingsessen:
            <select v-model="selectedFood">
              <option :value="null">Alle Essen</option>
              <option v-for="f in foodOptions" :key="f" :value="f">
                {{ f }}
              </option>
            </select>
          </label>

          <label>
            Lieblingsfarbe:
            <select v-model="selectedColor">
              <option :value="null">Alle Farben</option>
              <option v-for="c in colorOptions" :key="c" :value="c">
                {{ c }}
              </option>
            </select>
          </label>

          <label>
            Hobby:
            <select v-model="selectedHobby">
              <option :value="null">Alle Hobbys</option>
              <option v-for="h in hobbyOptions" :key="h" :value="h">
                {{ h }}
              </option>
            </select>
          </label>

          <label>
            Traumberuf:
            <select v-model="selectedDreamJob">
              <option :value="null">Alle Traumberufe</option>
              <option v-for="d in dreamJobOptions" :key="d" :value="d">
                {{ d }}
              </option>
            </select>
          </label>

          <button class="reset-btn" type="button" @click="resetFilter">
            Filter zurücksetzen
          </button>

        </div>
      </div>
    </div>

    <!-- CONTENT BEREICH (RECHTS) -->
    <div class="content">

      <!-- Buch-Ansicht -->
      <template v-if="!isFilterActive">
        <BookCover v-if="pageIndex < 0" />

        <div v-if="filteredPages.length" class="book-page-wrapper">
          <BookControls
            :hasPrev="pageIndex > 0"
            :hasNext="pageIndex < filteredPages.length - 1"
            @prev="prev"
            @next="next"
          />

          <FriendPage
            v-for="(p, i) in filteredPages"
            :key="p.id"
            :person="p"
            :visible="i === pageIndex"
            :isFavorite="favoriteSet.has(p.id)"
            @toggle-favorite="toggleFav(p.id)"
            @deleted="deleteEntry"
          />
        </div>
      </template>

      <!-- Listenansicht -->
      <template v-else>
        <p v-if="filteredPages.length === 0" class="empty">
          Keine Einträge gefunden.
        </p>

        <div class="list" v-else>
          <FriendPage
            v-for="p in filteredPages"
            :key="p.id"
            :person="p"
            :visible="true"
            :isFavorite="favoriteSet.has(p.id)"
            @toggle-favorite="toggleFav(p.id)"
            @deleted="deleteEntry"
          />
        </div>
      </template>

    </div>

  </div>
</template>

<style scoped>

.layout {
  display: flex;
  align-items: flex-start;
  gap: 40px;
  padding-left: 20px;
}

/* --- Sidebar links (Suche + Filter) --- */
.sidebar {
  width: 260px;
  flex-shrink: 0;
}


/* --- Inhalt rechts --- */
.content {
  flex: 1;
  min-width: 0;
}


/* --- Filterbar --- */
.filter-bar {
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(0, 0, 0, 0.12);
}

.filter-row {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* --- Suchfeld --- */
.search-wrapper {
  position: relative;
  width: 100%;
  margin-bottom: 10px;
}

.search-input {
  width: 100%;
  padding: 6px 30px 6px 12px;
  border-radius: 12px;
  border: 1px solid #fff;
  background: #f9fafb;
}

.search-clear {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: 0;
  font-size: 18px;
  cursor: pointer;
}


/* --- Buchseite --- */
.book-page-wrapper {
  position: relative;
  margin: 20px auto;
  max-width: 520px;
}


/* --- Liste --- */
.list {
  display: grid;
  gap: 12px;
}

.empty {
  opacity: 0.7;
}

</style>
