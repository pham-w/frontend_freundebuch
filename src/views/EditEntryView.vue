<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const API_BASE = "https://webtech-projekt-1-p0l3.onrender.com";
const route = useRoute();
const router = useRouter();

const id = Number(route.params.id);

const loading = ref(true);
const saving = ref(false);
const error = ref<string | null>(null);

const form = reactive({
  name: "",
  age: 0,
  geburtsdatum: "", // YYYY-MM-DD
  favColor: "",
  hobby: "",
  favFood: "",
  dreamJob: "",
});

// 1) Daten laden und Formular füllen
onMounted(async () => {
  try {
    const res = await fetch(`${API_BASE}/seite/${id}`);
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();

    form.name = data.name ?? "";
    form.age = data.age ?? 0;
    form.geburtsdatum = data.geburtsdatum ?? "";
    form.favColor = data.favColor ?? "";
    form.hobby = data.hobby ?? "";
    form.favFood = data.favFood ?? "";
    form.dreamJob = data.dreamJob ?? "";
  } catch (e: any) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
});

// 2) Speichern (PUT)
async function save() {
  error.value = null;
  saving.value = true;
  try {
    const res = await fetch(`${API_BASE}/seite/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`HTTP ${res.status}: ${text}`);
    }

    await res.json();
    router.push("/"); // zurück zur Home
  } catch (e: any) {
    error.value = e.message ?? "Unbekannter Fehler";
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <main style="padding: 20px; display: grid; gap: 12px;">
    <button @click="router.push('/')" style="width: fit-content;">
      ← Zurück
    </button>

    <h1 style="margin: 0;">Eintrag bearbeiten (ID: {{ id }})</h1>

    <p v-if="loading">Lade Daten…</p>
    <p v-else-if="error">Fehler: {{ error }}</p>

    <form v-else @submit.prevent="save" style="display:grid; gap:10px; max-width:520px;">
      <label> Name <input v-model.trim="form.name" /> </label>
      <label> Alter <input v-model.number="form.age" type="number" min="0" max="120" /> </label>
      <label> Geburtsdatum <input v-model="form.geburtsdatum" type="date" /> </label>
      <label> Lieblingsfarbe <input v-model.trim="form.favColor" /> </label>
      <label> Hobby <input v-model.trim="form.hobby" /> </label>
      <label> Lieblingsessen <input v-model.trim="form.favFood" /> </label>
      <label> Traumberuf <input v-model.trim="form.dreamJob" /> </label>

      <button type="submit" :disabled="saving">
        {{ saving ? "Speichere…" : "Änderungen speichern" }}
      </button>
    </form>
  </main>
</template>
