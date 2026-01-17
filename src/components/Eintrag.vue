<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { API_BASE } from "@/services/api";
import { authUser } from "@/services/authStore";

type FriendPayload = {
  name: string;
  geburtsdatum: string; // YYYY-MM-DD
  favColor: string;
  hobby: string;
  favFood: string;
  dreamJob: string;
  userId: number;
};

const form = reactive<FriendPayload>({
  name: "",
  geburtsdatum: "",
  favColor: "",
  hobby: "",
  favFood: "",
  dreamJob: "",
  userId: 0,
});

const loading = ref(false);
const error = ref<string | null>(null);
const success = ref(false);
const today = new Date().toISOString().slice(0, 10);
const emit = defineEmits<{
  (e: "created"): void;
}>();

function calcAge(birthDate: string | null | undefined): number {
  if (!birthDate) return 0;

  const birth = new Date(birthDate);
  const today = new Date();

  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;

  return age;
}

const computedAge = computed(() => calcAge(form.geburtsdatum));

async function submit() {
  error.value = null;
  success.value = false;

  if (!form.name.trim()) {
    error.value = "Bitte Name eingeben.";
    return;
  }
  if (!form.geburtsdatum) {
    error.value = "Bitte Geburtsdatum auswählen.";
    return;
  }
  if (form.geburtsdatum > today) {
    error.value = "Geburtsdatum darf nicht in der Zukunft liegen.";
    return;
  }
  const userId = authUser.value?.id;
  if (!userId) {
    error.value = "Nicht eingeloggt.";
    return;
  }

  form.userId = userId;
  loading.value = true;
  try {
    const payload = {
      name: form.name,
      geburtsdatum: form.geburtsdatum,
      favColor: form.favColor,
      hobby: form.hobby,
      favFood: form.favFood,
      dreamJob: form.dreamJob,
      userId: form.userId,
    };

    const res = await fetch(`${API_BASE}/seite`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`HTTP ${res.status}: ${text}`);
    }

    await res.json(); // gespeicherten Datensatz (optional)

    success.value = true;

    // Reset
    form.name = "";
    form.geburtsdatum = "";
    form.favColor = "";
    form.hobby = "";
    form.favFood = "";
    form.dreamJob = "";
    form.userId = userId;

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
      Alter (automatisch)
      <input :value="computedAge" type="number" disabled />
    </label>


    <label>
      Geburtsdatum
      <input v-model="form.geburtsdatum" type="date" :max="today" />
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
