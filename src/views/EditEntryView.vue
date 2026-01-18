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
  <main class="page">
    <section class="wrap">
      <h1>Eintrag bearbeiten</h1>

      <p v-if="loading">Lade Daten…</p>
      <p v-else-if="error" class="error">Fehler: {{ error }}</p>

      <form v-else class="card" @submit.prevent="save">
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
          <input v-model.trim="form.dreamJob" type="text" placeholder="z.B. Bäcker" />
        </label>

        <button type="submit" :disabled="saving">
          {{ saving ? "Speichere…" : "Änderungen speichern" }}
        </button>
      </form>
    </section>
  </main>
</template>

<style scoped>
.page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 20px;
  padding-top: 0; /* weiter nach oben = kleiner machen */
}

.wrap {
  width: 100%;
  max-width: 620px;
  display: grid;
  gap: 12px;
}

h1 {
  margin: 0;
  font-weight: 500;
}

.card {
  display: grid;
  gap: 10px;
  width: 100%;
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
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.2);
}

button {
  padding: 10px 14px;
  border-radius: 12px;
  border: 0;
  background: #852736;
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
</style>
