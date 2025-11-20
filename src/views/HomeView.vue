<script setup lang="ts">
import { ref, onMounted } from 'vue';

type Seite = {
  name: string;
  age: number;
  geburtsdatum: string;
  favColor: string;
  hobby: string;
  favFood: string;
  dreamJob: string;
  profile: string;
};

const profiles = ref<Seite[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
  try {
    const response = await fetch(
      "https://webtech-projekt-1-p0l3.onrender.com/seite"
    );
    if (!response.ok) {
      throw new Error("HTTP-Fehler " + response.status);
    }
    profiles.value = await response.json();
  } catch (e: any) {
    error.value = e.message ?? String(e);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <main style="padding: 2rem; color: white;">
    <h1>Freundebuch – Daten aus dem Backend</h1>

    <p v-if="loading">Lade Daten...</p>
    <p v-else-if="error">Fehler beim Laden: {{ error }}</p>

    <table v-else v-if="profiles.length" style="margin-top: 1rem; width: 100%;">
      <thead>
      <tr>
        <th>Name</th>
        <th>Alter</th>
        <th>Geburtsdatum</th>
        <th>Lieblingsfarbe</th>
        <th>Hobby</th>
        <th>Lieblingsessen</th>
        <th>Traumberuf</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="p in profiles" :key="p.name">
        <td>{{ p.name }}</td>
        <td>{{ p.age }}</td>
        <td>{{ p.geburtsdatum }}</td>
        <td>{{ p.favColor }}</td>
        <td>{{ p.hobby }}</td>
        <td>{{ p.favFood }}</td>
        <td>{{ p.dreamJob }}</td>
      </tr>
      </tbody>
    </table>

    <p v-else>Keine Profile gefunden.</p>
  </main>
</template>
