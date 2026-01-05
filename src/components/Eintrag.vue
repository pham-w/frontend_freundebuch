<script setup lang="ts">
import { reactive, ref } from "vue";

type FriendPayload = {
  name: string;
  age: number;
  geburtsdatum: string; // YYYY-MM-DD
  favColor: string;
  hobby: string;
  favFood: string;
  dreamJob: string;
};

const API_BASE = "https://webtech-projekt-1-p0l3.onrender.com";

const form = reactive<FriendPayload>({
  name: "",
  age: 0,
  geburtsdatum: "",
  favColor: "",
  hobby: "",
  favFood: "",
  dreamJob: "",
});

const loading = ref(false);
const error = ref<string | null>(null);
const success = ref(false);

const emit = defineEmits<{
  (e: "created"): void;
}>();

async function submit() {
  error.value = null;
  success.value = false;

  // Mini-Checks
  if (!form.name.trim()) {
    error.value = "Bitte Name eingeben.";
    return;
  }
  if (!form.geburtsdatum) {
    error.value = "Bitte Geburtsdatum auswählen.";
    return;
  }

  loading.value = true;
  try {
    const res = await fetch(`${API_BASE}/seite`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`HTTP ${res.status}: ${text}`);
    }

    await res.json(); // gespeicherten Datensatz (optional)

    success.value = true;

    // Reset
    form.name = "";
    form.age = 0;
    form.geburtsdatum = "";
    form.favColor = "";
    form.hobby = "";
    form.favFood = "";
    form.dreamJob = "";

    emit("created"); // Parent kann Liste neu laden
  } catch (e: any) {
    error.value = e?.message ?? "Unbekannter Fehler";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <form class="card" @submit.prevent="submit">
    <h2>Neuen Freund anlegen</h2>

    <label>
      Name
      <input v-model.trim="form.name" type="text" placeholder="z.B. Alex" />
    </label>

    <label>
      Alter
      <input v-model.number="form.age" type="number" min="0" max="120" />
    </label>

    <label>
      Geburtsdatum
      <input v-model="form.geburtsdatum" type="date" />
    </label>

    <label>
      Lieblingsfarbe
      <input v-model.trim="form.favColor" type="text" placeholder="z.B. Blau" />
    </label>

    <label>
      Hobby
      <input v-model.trim="form.hobby" type="text" placeholder="z.B. Lesen" />
    </label>

    <label>
      Lieblingsessen
      <input v-model.trim="form.favFood" type="text" placeholder="z.B. Pizza" />
    </label>

    <label>
      Traumberuf
      <input v-model.trim="form.dreamJob" type="text" placeholder="z.B. Dev" />
    </label>

    <button type="submit" :disabled="loading">
      {{ loading ? "Speichere…" : "Speichern" }}
    </button>

    <p v-if="error" class="error">Fehler: {{ error }}</p>
    <p v-if="success" class="ok">✅ Gespeichert!</p>
  </form>
</template>

<style scoped>
.card {
  display: grid;
  gap: 10px;
  max-width: 520px;
  padding: 16px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 12px;
  background: white;
}

label {
  display: grid;
  gap: 6px;
  font-size: 14px;
  color: #181818;
}

input {
  padding: 10px;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.2);
}

button {
  padding: 10px 14px;
  border-radius: 10px;
  border: 0;
  background: #111827;
  color: white;
  font-weight: 600;
  cursor: pointer;
}

button:disabled {
  opacity: 0.6;
  cursor: default;
}

.error {
  color: #b91c1c;
  margin: 0;
}

.ok {
  color: #15803d;
  margin: 0;
}
</style>
