<script setup lang="ts">
import { ref, onMounted } from 'vue';

const profiles = ref([]);
const loading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
  try {
    const response = await fetch("https://webtech-projekt-1-p0l3.onrender.com/seite");
    if (!response.ok) throw new Error("HTTP " + response.status);
    profiles.value = await response.json();
  } catch (e: any) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <main style="padding:20px;">
    <h1>API Test – Daten vom Backend</h1>

    <p v-if="loading">Lade Daten…</p>
    <p v-if="error">Fehler: {{ error }}</p>

    <pre v-if="profiles.length">{{ profiles }}</pre>
  </main>
</template>
