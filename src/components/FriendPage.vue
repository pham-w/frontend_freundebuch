<script setup lang="ts">
defineProps<{ person: any; visible: boolean }>()
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
  </div>
</template>

<style scoped>
.page {
  border: 1px solid #ddd;
  padding: 20px;
  margin: 10px;
  background: #fff;
  color: #181818;
}
</style>
