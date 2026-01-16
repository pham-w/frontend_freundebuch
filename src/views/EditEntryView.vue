<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { API_BASE } from "@/services/api";
import { authUser } from "@/services/authStore";

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

// 1) Daten laden (GET braucht bei dir kein userId)
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
    error.value = e?.message ?? String(e);
  } finally {
    loading.value = false;
  }
});

// 2) Speichern (PUT braucht userId als Query)
async function save() {
  error.value = null;

  const uid = authUser.value?.id;
  if (!uid) {
    error.value = "Nicht eingeloggt.";
    return;
  }

  saving.value = true;
  try {
    const res = await fetch(`${API_BASE}/seite/${id}?userId=${uid}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`HTTP ${res.status}: ${text}`);
    }

    await res.json();
    router.push("/");
  } catch (e: any) {
    error.value = e?.message ?? "Unbekannter Fehler";
  } finally {
    saving.value = false;
  }
}
</script>
