<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import FriendPage from "./FriendPage.vue";
import BookCover from "./BookCover.vue";
import BookControls from "./BookControls.vue";

type Friend = {
  id: number;
  name: string;
  age: number;
  geburtsdatum: string;
  favColor: string;
  hobby: string;
  favFood: string;
  dreamJob: string;
};

const allPages = ref<Friend[]>([]);
const pageIndex = ref(-1);
const loading = ref(true);
const error = ref<string | null>(null);

// 🔎 Suche + Filter (Buttons)
const search = ref("");
const activeColor = ref<string | null>(null);
const activeHobby = ref<string | null>(null);
const activeJob = ref<string | null>(null);

onMounted(async () => {
  try {
    const res = await fetch("https://webtech-projekt-1-p0l3.onrender.com/seite");
    if (!res.ok) throw new Error("HTTP " + res.status);
    allPages.value = await res.json();
  } catch (e: any) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
});

// ---- Options für Buttons (einzigartige Werte) ----
function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean).map(v => v.trim()))).sort((a, b) =>
    a.localeCompare(b, "de")
  );
}

const colorOptions = computed(() => unique(allPages.value.map(p => p.favColor)));
const hobbyOptions = computed(() => unique(allPages.value.map(p => p.hobby)));
const jobOptions = computed(() => unique(allPages.value.map(p => p.dreamJob)));

// ---- Suche (über mehrere Felder) ----
function matchesSearch(p: Friend) {
  const q = search.value.trim().toLowerCase();
  if (!q) return true;

  const hay = [
    p.name,
    String(p.age),
    p.geburtsdatum,
    p.favColor,
    p.hobby,
    p.favFood,
    p.dreamJob,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return hay.includes(q);
}

// ---- Gefilterte Liste ----
const filteredPages = computed(() => {
  return allPages.value.filter((p) => {
    if (activeColor.value && p.favColor !== activeColor.value) return false;
    if (activeHobby.value && p.hobby !== activeHobby.value) return false;
    if (activeJob.value && p.dreamJob !== activeJob.value) return false;
    if (!matchesSearch(p)) return false;
    return true;
  });
});

// ---- Toggle für Buttons ----
function toggle(which: "color" | "hobby" | "job", value: string) {
  if (which === "color") activeColor.value = activeColor.value === value ? null : value;
  if (which === "hobby") activeHobby.value = activeHobby.value === value ? null : value;
  if (which === "job") activeJob.value = activeJob.value === value ? null : value;
}

function resetFilters() {
  search.value = "";
  activeColor.value = null;
  activeHobby.value = null;
  activeJob.value = null;
}

// ---- PageIndex passend zur gefilterten Liste halten ----
// Wenn Filter/Suche geändert -> zurück aufs Cover (wirkt am logischsten)
watch([search, activeColor, activeHobby, activeJob], () => {
  pageIndex.value = -1;
});

// Controls arbeiten auf gefilterter Liste
const next = () => pageIndex.value < filteredPages.value.length - 1 && pageIndex.value++;
const prev = () => pageIndex.value >= 0 && pageIndex.value--;
</script>

<template>
  <div class="wrap">
    <p v-if="loading">Lade Freundebuch…</p>
    <p v-else-if="error">Fehler: {{ error }}</p>

    <template v-else>
      <!-- 🔎 Toolbar: Suche + Button-Filter -->
      <div class="toolbar">
        <input
          v-model="search"
          class="search"
          type="text"
          placeholder="Suchen (Name, Hobby, Farbe, Essen, Beruf …)"
        />

        <div class="filters">
          <div class="group">
            <span class="label">Farbe:</span>
            <button
              v-for="c in colorOptions"
              :key="c"
              class="chip"
              :class="{ active: activeColor === c }"
              @click="toggle('color', c)"
              type="button"
            >
              {{ c }}
            </button>
          </div>

          <div class="group">
            <span class="label">Hobby:</span>
            <button
              v-for="h in hobbyOptions"
              :key="h"
              class="chip"
              :class="{ active: activeHobby === h }"
              @click="toggle('hobby', h)"
              type="button"
            >
              {{ h }}
            </button>
          </div>

          <div class="group">
            <span class="label">Beruf:</span>
            <button
              v-for="j in jobOptions"
              :key="j"
              class="chip"
              :class="{ active: activeJob === j }"
              @click="toggle('job', j)"
              type="button"
            >
              {{ j }}
            </button>
          </div>
        </div>

        <div class="meta">
          <span>Treffer: {{ filteredPages.length }} / {{ allPages.length }}</span>
          <button class="reset" type="button" @click="resetFilters">Reset</button>
        </div>
      </div>

      <!-- Cover -->
      <BookCover v-if="pageIndex < 0" />

      <!-- Wenn keine Treffer -->
      <p v-if="filteredPages.length === 0" class="empty">
        Keine Treffer – ändere Suche/Filter.
      </p>

      <!-- Seiten: nur gefilterte -->
      <FriendPage
        v-for="(p, i) in filteredPages"
        :key="p.id"
        :person="p"
        :visible="i === pageIndex"
      />

      <!-- Controls beziehen sich auf filteredPages -->
      <BookControls
        :hasPrev="pageIndex >= 0"
        :hasNext="pageIndex < filteredPages.length - 1"
        @next="next"
        @prev="prev"
      />
    </template>
  </div>
</template>

<style scoped>
.wrap {
  display: grid;
  gap: 12px;
}

/* Toolbar */
.toolbar {
  display: grid;
  gap: 10px;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid rgba(0,0,0,0.12);
  background: rgba(255,255,255,0.8);
}

.search {
  padding: 10px;
  border-radius: 10px;
  border: 1px solid rgba(0,0,0,0.2);
}

.filters {
  display: grid;
  gap: 8px;
}

.group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.label {
  font-size: 12px;
  opacity: 0.7;
  margin-right: 4px;
}

.chip {
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid rgba(0,0,0,0.15);
  background: white;
  cursor: pointer;
  font-size: 13px;
}

.chip.active {
  background: #111827;
  color: white;
  border-color: #111827;
}

.meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-size: 12px;
  opacity: 0.8;
}

.reset {
  padding: 8px 12px;
  border-radius: 10px;
  border: 0;
  background: rgba(0,0,0,0.08);
  cursor: pointer;
}

.empty {
  margin: 0;
  opacity: 0.75;
}
</style>
<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import FriendPage from "./FriendPage.vue";
import BookCover from "./BookCover.vue";
import BookControls from "./BookControls.vue";

type Friend = {
  id: number;
  name: string;
  age: number;
  geburtsdatum: string;
  favColor: string;
  hobby: string;
  favFood: string;
  dreamJob: string;
};

const allPages = ref<Friend[]>([]);
const pageIndex = ref(-1);
const loading = ref(true);
const error = ref<string | null>(null);

// 🔎 Suche + Filter (Buttons)
const search = ref("");
const activeColor = ref<string | null>(null);
const activeHobby = ref<string | null>(null);
const activeJob = ref<string | null>(null);

onMounted(async () => {
  try {
    const res = await fetch("https://webtech-projekt-1-p0l3.onrender.com/seite");
    if (!res.ok) throw new Error("HTTP " + res.status);
    allPages.value = await res.json();
  } catch (e: any) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
});

// ---- Options für Buttons (einzigartige Werte) ----
function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean).map(v => v.trim()))).sort((a, b) =>
    a.localeCompare(b, "de")
  );
}

const colorOptions = computed(() => unique(allPages.value.map(p => p.favColor)));
const hobbyOptions = computed(() => unique(allPages.value.map(p => p.hobby)));
const jobOptions = computed(() => unique(allPages.value.map(p => p.dreamJob)));

// ---- Suche (über mehrere Felder) ----
function matchesSearch(p: Friend) {
  const q = search.value.trim().toLowerCase();
  if (!q) return true;

  const hay = [
    p.name,
    String(p.age),
    p.geburtsdatum,
    p.favColor,
    p.hobby,
    p.favFood,
    p.dreamJob,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return hay.includes(q);
}

// ---- Gefilterte Liste ----
const filteredPages = computed(() => {
  return allPages.value.filter((p) => {
    if (activeColor.value && p.favColor !== activeColor.value) return false;
    if (activeHobby.value && p.hobby !== activeHobby.value) return false;
    if (activeJob.value && p.dreamJob !== activeJob.value) return false;
    if (!matchesSearch(p)) return false;
    return true;
  });
});

// ---- Toggle für Buttons ----
function toggle(which: "color" | "hobby" | "job", value: string) {
  if (which === "color") activeColor.value = activeColor.value === value ? null : value;
  if (which === "hobby") activeHobby.value = activeHobby.value === value ? null : value;
  if (which === "job") activeJob.value = activeJob.value === value ? null : value;
}

function resetFilters() {
  search.value = "";
  activeColor.value = null;
  activeHobby.value = null;
  activeJob.value = null;
}

// ---- PageIndex passend zur gefilterten Liste halten ----
// Wenn Filter/Suche geändert -> zurück aufs Cover (wirkt am logischsten)
watch([search, activeColor, activeHobby, activeJob], () => {
  pageIndex.value = -1;
});

// Controls arbeiten auf gefilterter Liste
const next = () => pageIndex.value < filteredPages.value.length - 1 && pageIndex.value++;
const prev = () => pageIndex.value >= 0 && pageIndex.value--;
</script>

<template>
  <div class="wrap">
    <p v-if="loading">Lade Freundebuch…</p>
    <p v-else-if="error">Fehler: {{ error }}</p>

    <template v-else>
      <!-- 🔎 Toolbar: Suche + Button-Filter -->
      <div class="toolbar">
        <input
          v-model="search"
          class="search"
          type="text"
          placeholder="Suchen (Name, Hobby, Farbe, Essen, Beruf …)"
        />

        <div class="filters">
          <div class="group">
            <span class="label">Farbe:</span>
            <button
              v-for="c in colorOptions"
              :key="c"
              class="chip"
              :class="{ active: activeColor === c }"
              @click="toggle('color', c)"
              type="button"
            >
              {{ c }}
            </button>
          </div>

          <div class="group">
            <span class="label">Hobby:</span>
            <button
              v-for="h in hobbyOptions"
              :key="h"
              class="chip"
              :class="{ active: activeHobby === h }"
              @click="toggle('hobby', h)"
              type="button"
            >
              {{ h }}
            </button>
          </div>

          <div class="group">
            <span class="label">Beruf:</span>
            <button
              v-for="j in jobOptions"
              :key="j"
              class="chip"
              :class="{ active: activeJob === j }"
              @click="toggle('job', j)"
              type="button"
            >
              {{ j }}
            </button>
          </div>
        </div>

        <div class="meta">
          <span>Treffer: {{ filteredPages.length }} / {{ allPages.length }}</span>
          <button class="reset" type="button" @click="resetFilters">Reset</button>
        </div>
      </div>

      <!-- Cover -->
      <BookCover v-if="pageIndex < 0" />

      <!-- Wenn keine Treffer -->
      <p v-if="filteredPages.length === 0" class="empty">
        Keine Treffer – ändere Suche/Filter.
      </p>

      <!-- Seiten: nur gefilterte -->
      <FriendPage
        v-for="(p, i) in filteredPages"
        :key="p.id"
        :person="p"
        :visible="i === pageIndex"
      />

      <!-- Controls beziehen sich auf filteredPages -->
      <BookControls
        :hasPrev="pageIndex >= 0"
        :hasNext="pageIndex < filteredPages.length - 1"
        @next="next"
        @prev="prev"
      />
    </template>
  </div>
</template>

<style scoped>
.wrap {
  display: grid;
  gap: 12px;
}

/* Toolbar */
.toolbar {
  display: grid;
  gap: 10px;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid rgba(0,0,0,0.12);
  background: rgba(255,255,255,0.8);
}

.search {
  padding: 10px;
  border-radius: 10px;
  border: 1px solid rgba(0,0,0,0.2);
}

.filters {
  display: grid;
  gap: 8px;
}

.group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.label {
  font-size: 12px;
  opacity: 0.7;
  margin-right: 4px;
}

.chip {
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid rgba(0,0,0,0.15);
  background: white;
  cursor: pointer;
  font-size: 13px;
}

.chip.active {
  background: #111827;
  color: white;
  border-color: #111827;
}

.meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-size: 12px;
  opacity: 0.8;
}

.reset {
  padding: 8px 12px;
  border-radius: 10px;
  border: 0;
  background: rgba(0,0,0,0.08);
  cursor: pointer;
}

.empty {
  margin: 0;
  opacity: 0.75;
}
</style>
