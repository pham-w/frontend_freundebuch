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
  background: #111827;
  color: #ffffff;
  border: 1px solid rgba(255,255,255,0.12);
  box-shadow: 0 10px 26px rgba(0,0,0,0.45);
  border-radius: 999px;
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
.nav-btn:hover:not(:disabled) {
  opacity: 0.92;
}
.nav-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

</style>
