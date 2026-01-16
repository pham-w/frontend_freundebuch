<script setup lang="ts">
import { ref, computed, watch } from "vue";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";

import { API_BASE } from "@/services/api";
import { authUser } from "@/services/authStore";

const pages = ref<any[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

// 🔁 Daten laden – analog zu FriendBook, inkl. userId
async function loadPages() {
  loading.value = true;
  error.value = null;

  try {
    const uid = authUser.value?.id;
    if (!uid) {
      pages.value = [];
      return;
    }

    const res = await fetch(`${API_BASE}/seite?userId=${uid}`);
    if (!res.ok) throw new Error("HTTP " + res.status);

    const data = await res.json();
    pages.value = data.sort((a: any, b: any) => a.id - b.id);
  } catch (e: any) {
    error.value = e?.message ?? String(e);
  } finally {
    loading.value = false;
  }
}

// 🎂 nächster Geburtstag (dieses oder nächstes Jahr)
function computeNextBirthday(geburtsdatum: string): string | null {
  if (!geburtsdatum) return null;
  const [y, m, d] = geburtsdatum.split("-");
  if (!y || !m || !d) return null;

  const month = Number(m) - 1;
  const day = Number(d);

  const today = new Date();
  const currentYear = today.getFullYear();

  let candidate = new Date(currentYear, month, day);

  const todayNoTime = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  if (candidate < todayNoTime) {
    candidate = new Date(currentYear + 1, month, day);
  }

  return candidate.toISOString().slice(0, 10); // YYYY-MM-DD
}

// 📅 Events für FullCalendar
const events = computed(() => {
  return pages.value
    .map((p) => {
      const next = computeNextBirthday(String(p.geburtsdatum));
      if (!next) return null;

      return {
        title: p.name ?? "Unbenannt",
        start: next,
        allDay: true,
      };
    })
    .filter((e) => e !== null);
});

// zusätzlich: Liste der nächsten Geburtstage (sortiert)
const upcoming = computed(() => {
  return events.value
    .map((e: any) => ({
      title: e.title,
      date: e.start,
    }))
    .sort((a, b) => (a.date < b.date ? -1 : 1))
    .slice(0, 10); // z.B. nächste 10
});

// FullCalendar Optionen
const calendarOptions = computed(() => ({
  plugins: [dayGridPlugin],
  initialView: "dayGridMonth",
  locale: "de",
  firstDay: 1,
  headerToolbar: {
    left: "prev,next today",
    center: "title",
    right: "",
  },
  events: events.value,
}));

// bei Login/Logout neu laden
watch(
  authUser,
  () => {
    loadPages();
  },
  { immediate: true }
);
</script>

<template>
  <main class="calendar-wrapper">
    <h1>Geburtstagskalender</h1>

    <p v-if="loading">Lade Geburtstage …</p>
    <p v-if="error" class="error">Fehler: {{ error }}</p>

    <section v-if="!loading && !error">
      <p v-if="!events.length">Noch keine Geburtstage vorhanden.</p>

      <div v-if="events.length" class="layout">
        <div class="calendar-box">
          <FullCalendar :options="calendarOptions" />
        </div>

        <aside class="sidebar">
          <h2>Nächste Geburtstage</h2>
          <ul v-if="upcoming.length">
            <li v-for="u in upcoming" :key="u.date + u.title">
              <strong>{{ u.title }}</strong><br />
              <span>{{ u.date }}</span>
            </li>
          </ul>
          <p v-else>Keine kommenden Geburtstage gefunden.</p>
        </aside>
      </div>
    </section>
  </main>
</template>

<style scoped>
.calendar-wrapper {
  padding: 20px;
  max-width: 1100px;
  margin: 0 auto;
}

.layout {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
  gap: 16px;
  align-items: flex-start;
}

.calendar-box {
  background: white;
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

.sidebar {
  background: white;
  border-radius: 12px;
  padding: 12px 14px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  font-size: 14px;
}

.sidebar h2 {
  margin-top: 0;
  margin-bottom: 8px;
  font-size: 16px;
}

.sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar li {
  padding: 6px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.sidebar li:last-child {
  border-bottom: none;
}

.error {
  color: #b91c1c;
}
</style>
