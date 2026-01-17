<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { API_BASE } from "@/services/api";
import { authUser } from "@/services/authStore";
import { computed, onMounted, reactive, ref } from "vue";

const today = new Date().toISOString().slice(0, 10);
const route = useRoute();
const router = useRouter();

const id = Number(route.params.id);

const loading = ref(true);
const saving = ref(false);
const error = ref<string | null>(null);

const form = reactive({
  name: "",
  geburtsdatum: "", // YYYY-MM-DD
  favColor: "",
  hobby: "",
  favFood: "",
  dreamJob: "",
});

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

onMounted(async () => {
  try {
    const res = await fetch(`${API_BASE}/seite/${id}`);
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();

    form.name = data.name ?? "";
    form.geburtsdatum = data.geburtsdatum ?? "";
    form.favColor = data.favColor ?? "";
    form.hobby = data.hobby ?? "";
    form.favFood = data.favFood ?? "";
    form.dreamJob = data.dreamJob ?? "";
  } catch (e: any) {
    error.value = e?.message ?? String(e);
  } finally {
    loading.value = false;
  }
});

async function save() {
  error.value = null;

  const uid = authUser.value?.id;
  if (!uid) {
    error.value = "Nicht eingeloggt.";
    return;
  }

  saving.value = true;
  try {
    const payload = {
      name: form.name,
      geburtsdatum: form.geburtsdatum,
      favColor: form.favColor,
      hobby: form.hobby,
      favFood: form.favFood,
      dreamJob: form.dreamJob,
    };

    const res = await fetch(`${API_BASE}/seite/${id}?userId=${uid}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`HTTP ${res.status}: ${text}`);
    }

    await res.json();
    await router.push("/");
  } catch (e: any) {
    error.value = e?.message ?? "Unbekannter Fehler";
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

    <form
      v-else
      @submit.prevent="save"
      style="display:grid; gap:10px; max-width:520px;"
    >
      <label> Name <input v-model.trim="form.name" /> </label>
      <label>
        Alter (automatisch)
        <input :value="computedAge" type="number" disabled />
      </label>
      <label>
        Geburtsdatum
        <input v-model="form.geburtsdatum" type="date" :max="today" />
      </label>
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
