<script setup lang="ts">
defineProps<{ hasPrev: boolean; hasNext: boolean }>()
defineEmits(["prev", "next"])
</script>

<template>
  <button
    class="nav-btn left"
    :disabled="!hasPrev"
    @click="$emit('prev')"
    aria-label="Zurück"
  >
    ‹
  </button>

  <button
    class="nav-btn right"
    :disabled="!hasNext"
    @click="$emit('next')"
    aria-label="Weiter"
  >
    ›
  </button>
</template>

<style scoped>
.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  border-radius: 999px;
  border: none;
  background: white;
  color: #181818;
  font-size: 26px;
  cursor: pointer;
  display: grid;
  place-items: center;
  z-index: 10;
}

.left  { left: -56px; }
.right { right: -56px; }

@media (max-width: 900px) {
  .left { left: 8px; }
  .right { right: 8px; }
}

</style>
