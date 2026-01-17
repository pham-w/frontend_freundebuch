<script setup lang="ts">
import { ref, computed, watch } from "vue";
import FriendPage from "./FriendPage.vue";
import BookCover from "./BookCover.vue";
import BookControls from "./BookControls.vue";

import { API_BASE } from "@/services/api";
import { authUser } from "@/services/authStore";

const pages = ref<any[]>([]);
const pageIndex = ref(-1);
const loading = ref(true);
const error = ref<string | null>(null);

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
      return;
    }

    const res = await fetch(`${API_BASE}/seite?userId=${uid}`);
    if (!res.ok) throw new Error("HTTP " + res.status);

    const data = await res.json();
    pages.value = data.sort((a: any, b: any) => a.id - b.id);

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
  <div>
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


    <!-- 🔝 Button zum Ein-/Ausblenden der Filter -->
    <div class="top-bar">
      <button
        class="filter-toggle-btn"
        type="button"
        @click="showFilters = !showFilters"
      >
        {{ showFilters ? "Filter ausblenden" : "Filter anzeigen" }}
      </button>
    </div>

    <p v-if="loading">Lade Freundebuch…</p>
    <p v-if="error">Fehler: {{ error }}</p>

    <!-- FILTERLEISTE – nur wenn showFilters = true -->
    <div v-if="!loading && !error && showFilters" class="filter-bar">
      <div class="filter-row">
        <!-- Geburtsmonat -->
        <label>
          Geburtsmonat:
          <select v-model="selectedMonth">
            <option :value="null">Alle Monate</option>
            <option v-for="m in monthOptions" :key="m.value" :value="m.value">
              {{ m.label }}
            </option>
          </select>
        </label>

        <!-- Alter -->
        <label>
          Alter:
          <select v-model="selectedAge">
            <option :value="null">Alle Alter</option>
            <option v-for="a in ageOptions" :key="a" :value="a">
              {{ a }}
            </option>
          </select>
        </label>

        <!-- Lieblingsessen -->
        <label>
          Lieblingsessen:
          <select v-model="selectedFood">
            <option :value="null">Alle Essen</option>
            <option v-for="f in foodOptions" :key="f" :value="f">
              {{ f }}
            </option>
          </select>
        </label>

        <!-- Lieblingsfarbe -->
        <label>
          Lieblingsfarbe:
          <select v-model="selectedColor">
            <option :value="null">Alle Farben</option>
            <option v-for="c in colorOptions" :key="c" :value="c">
              {{ c }}
            </option>
          </select>
        </label>

        <!-- Hobby -->
        <label>
          Hobby:
          <select v-model="selectedHobby">
            <option :value="null">Alle Hobbys</option>
            <option v-for="h in hobbyOptions" :key="h" :value="h">
              {{ h }}
            </option>
          </select>
        </label>

        <!-- Traumberuf -->
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

      <p class="meta">
        <span v-if="isFilterActive">
          Gefilterte Einträge: {{ filteredPages.length }} von {{ pages.length }}
        </span>
        <span v-else>Einträge gesamt: {{ pages.length }}</span>
      </p>
    </div>

    <!-- 📖 Buch-Ansicht (wenn NICHTS gefiltert/gesucht wird) -->
    <template v-if="!isFilterActive">
      <BookCover v-if="pageIndex < 0" />

      <p v-if="!loading && !error && filteredPages.length === 0" class="empty">
        Noch keine Einträge vorhanden.
      </p>

      <div class="book-page-wrapper" v-if="filteredPages.length">
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
          @deleted="deleteEntry"
        />
      </div>
    </template>

    <!-- 📋 Listen-Ansicht (wenn Suche/Filter aktiv) -->
    <template v-else>
      <p v-if="!loading && !error && filteredPages.length === 0" class="empty">
        Keine Einträge mit diesen Kriterien gefunden.
      </p>

      <div v-else class="list">
        <FriendPage
          v-for="p in filteredPages"
          :key="p.id"
          :person="p"
          :visible="true"
          @deleted="deleteEntry"
        />
      </div>
    </template>
  </div>
</template>

<style scoped>
.book-page-wrapper {
  position: relative;
  margin: 20px auto;
  max-width: 520px;
}

.search-wrapper {
  position: relative;
  max-width: 260px;
  margin: 0 10px 10px;
}

.search-input {
  width: 100%;
  padding: 6px 30px 6px 12px;
  border-radius: 12px;
  border: 1px solid #fff;
  background: #f9fafb;
  font-size: 14px;
  outline: none;
}

.search-input:focus {
  box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.5);
}

.search-clear {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  padding: 0;
  color: #111827;
}

/* Button-Zeile für Filter-Toggle */
.top-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0 10px 4px;
}

.filter-toggle-btn {
  padding: 8px 14px;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  background: white;
  cursor: pointer;
  font-size: 14px;
}
.filter-toggle-btn:hover {
  background: #111827;
  color: white;
}

/* Filterleiste */
.filter-bar {
  margin: 10px;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  background: rgba(255, 255, 255, 0.85);
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

label {
  font-size: 14px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
}

select {
  padding: 6px 8px;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.2);
}

.reset-btn {
  padding: 6px 10px;
  border-radius: 12px;
  border: 0;
  background: rgba(0, 0, 0, 0.08);
  cursor: pointer;
  font-size: 13px;
}

.meta {
  font-size: 12px;
  opacity: 0.75;
  margin-top: 6px;
}

.empty {
  margin: 10px;
  opacity: 0.75;
}

.list {
  display: grid;
  gap: 8px;
}
</style>
