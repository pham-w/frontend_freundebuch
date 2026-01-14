<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

defineProps<{ person: any; visible: boolean }>();

function editEntry(id: number) {
  router.push(`/edit/${id}`);
}
</script>

<template>
  <div v-show="visible" class="page">
    <h2>{{ person.name }}</h2>

    <ul>
      <li>Alter: {{ person.age }}</li>
      <li>Geburtsdatum: {{ person.geburtsdatum }}</li>
      <li>Lieblingsfarbe: {{ person.favColor }}</li>
      <li>Hobby: {{ person.hobby }}</li>
      <li>Lieblingsessen: {{ person.favFood }}</li>
      <li>Traumberuf: {{ person.dreamJob }}</li>
    </ul>

    <!-- ✏️ Bearbeiten Button -->
    <button class="edit-btn" @click="editEntry(person.id)">
      ✏️ Eintrag bearbeiten
    </button>
  </div>
</template>

<style scoped>
.page {
  border: 1px solid #ddd;
  padding: 20px;
  margin: 10px;
  background: #fff;
  color: #181818;
  position: relative;
}

/* Button-Design: dezent */
.edit-btn {
  margin-top: 12px;
  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid rgba(0,0,0,0.25);
  background: white;
  cursor: pointer;
  font-size: 13px;
}

.edit-btn:hover {
  background: #111827;
  color: white;
}
</style>
