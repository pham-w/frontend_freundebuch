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

// -------------------- FILTER --------------------
type FilterType = "none" | "month" | "food" | "color";
const filterType = ref<FilterType>("none");
const filterValue = ref<string | null>(null);

const isFilterActive = computed(
  () => filterType.value !== "none" && !!filterValue.value
);

function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean).map((v) => v.trim()))).sort(
    (a, b) => a.localeCompare(b, "de")
  );
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
      return s.slice(5, 7);
    })
    .filter((m) => !!m) as string[];

  return unique(months).map((m) => ({
    value: m,
    label: monthNames[m] ?? m,
  }));
});

const foodOptions = computed(() => unique(pages.value.map((p) => p.favFood)));
const colorOptions = computed(() => unique(pages.value.map((p) => p.favColor)));

const filteredPages = computed(() => {
  let list = pages.value;

  if (filterType.value === "month" && filterValue.value) {
    list = list.filter((p) => {
      if (!p.geburtsdatum) return false;
      const s = String(p.geburtsdatum);
      if (s.length < 7) return false;
      return s.slice(5, 7) === filterValue.value;
    });
  } else if (filterType.value === "food" && filterValue.value) {
    list = list.filter((p) => p.favFood === filterValue.value);
  } else if (filterType.value === "color" && filterValue.value) {
    list = list.filter((p) => p.favColor === filterValue.value);
  }

  return list;
});

// Filteränderung → zurück zum Cover (Buchmodus)
watch([filterType, filterValue], () => {
  pageIndex.value = -1;
});

function resetFilter() {
  filterType.value = "none";
  filterValue.value = null;
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

    // Standard: Cover zeigen, aber wenn du lieber direkt erste Seite willst,
    // setz hier auf 0 (wenn pages vorhanden)
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

    // lokal entfernen
    pages.value = pages.value.filter((p) => p.id !== id);

    // pageIndex sinnvoll korrigieren:
    // - Im Buchmodus: anhand filteredPages
    // - Im Filtermodus: du zeigst eh alle Einträge; aber Index trotzdem safe halten
    if (!isFilterActive.value) {
      if (filteredPages.value.length === 0) {
        pageIndex.value = -1;
      } else if (pageIndex.value >= filteredPages.value.length) {
        pageIndex.value = filteredPages.value.length - 1;
      }
    } else {
      // falls du aus irgendeinem Grund pageIndex nutzt, halte ihn gültig
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
    <p v-if="loading">Lade Freundebuch…</p>
    <p v-if="error">Fehler: {{ error }}</p>

    <!-- Filterleiste -->
    <div v-if="!loading && !error" class="filter-bar">
      <div class="filter-row">
        <label>
          Filtertyp:
          <select v-model="filterType">
            <option value="none">Kein Filter</option>
            <option value="month">Geburtsmonat</option>
            <option value="food">Lieblingsessen</option>
            <option value="color">Lieblingsfarbe</option>
          </select>
        </label>

        <label v-if="filterType !== 'none'">
          Wert:
          <!-- Geburtsmonat -->
          <select v-if="filterType === 'month'" v-model="filterValue">
            <option :value="null">Alle Monate</option>
            <option v-for="m in monthOptions" :key="m.value" :value="m.value">
              {{ m.label }}
            </option>
          </select>

          <!-- Lieblingsessen -->
          <select v-else-if="filterType === 'food'" v-model="filterValue">
            <option :value="null">Alle Essen</option>
            <option v-for="f in foodOptions" :key="f" :value="f">
              {{ f }}
            </option>
          </select>

          <!-- Lieblingsfarbe -->
          <select v-else-if="filterType === 'color'" v-model="filterValue">
            <option :value="null">Alle Farben</option>
            <option v-for="c in colorOptions" :key="c" :value="c">
              {{ c }}
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
        <span v-else> Einträge gesamt: {{ pages.length }} </span>
      </p>
    </div>

    <!-- Buch-Ansicht -->
    <template v-if="!isFilterActive">
      <BookCover v-if="pageIndex < 0" />

      <p v-if="!loading && !error && filteredPages.length === 0" class="empty">
        Noch keine Einträge vorhanden.
      </p>

      <FriendPage
        v-for="(p, i) in filteredPages"
        :key="p.id"
        :person="p"
        :visible="i === pageIndex"
        @deleted="deleteEntry"
      />

      <BookControls
        :hasPrev="pageIndex >= 0"
        :hasNext="pageIndex < filteredPages.length - 1"
        @next="next"
        @prev="prev"
      />
    </template>

    <!-- Filter-Ansicht -->
    <template v-else>
      <p v-if="!loading && !error && filteredPages.length === 0" class="empty">
        Keine Einträge mit diesem Filter gefunden.
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
.filter-bar {
  margin: 10px;
  padding: 10px 12px;
  border-radius: 10px;
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
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.2);
}

.reset-btn {
  padding: 6px 10px;
  border-radius: 8px;
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
