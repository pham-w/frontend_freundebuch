<template>
  <div class="page empty">
    <div class="content">
      <h2>{{ title }}</h2>
      <p>{{ message }}</p>

      <p v-if="hint" class="hint">{{ hint }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  message: string;
  hint?: string;
}>();
</script>

<style scoped>
/* gleiche "Seite" wie FriendPage */
.page {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  padding: 20px;
  background: #fff;
  color: #181818;
  position: relative;
  overflow: auto;
}

.empty {
  display: grid;
  place-items: center;
  text-align: center;
}

.content h2 {
  margin: 0 0 10px;
  font-size: 1.4rem;
  color: #111827;
}

.content p {
  margin: 0;
  color: #374151;
}

.hint {
  margin-top: 14px;
  opacity: 0.8;
  font-size: 0.95rem;
}
</style>
