<script setup lang="ts">
defineProps<{ hasPrev: boolean; hasNext: boolean }>()
defineEmits(['prev', 'next'])
</script>

<template>
  <div class="controls">
    <button @click="$emit('prev')" :disabled="!hasPrev">← Zurück</button>
    <button @click="$emit('next')" :disabled="!hasNext">Weiter →</button>
  </div>
</template>

<style scoped>
.controls {
  display: flex;
  justify-content: center;
  gap: 10px;
}
</style>
