<script setup lang="ts">
/* keine Logik */
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="-5 -8 110 110"
    width="120"
    height="120"
    class="star-logo"
    aria-label="Star Logo"
    role="img"
  >
    <defs>
      <!-- Gradient -->
      <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#F5E6A8" />
        <stop offset="50%" stop-color="#F0DC8E" />
        <stop offset="100%" stop-color="#E8D078" />
      </linearGradient>

      <!-- Subtile Textur (optional) -->
      <filter id="noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" />
        <feColorMatrix type="saturate" values="0" />
        <feBlend mode="multiply" in="SourceGraphic" />
      </filter>

      <!-- Shadow (optional) -->
      <filter id="drop" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="rgba(0,0,0,0.15)" />
      </filter>
    </defs>

    <!-- ⭐ Nur der Stern -->
    <path
      d="M 50 0
         L 61.76 33.82
         L 97.55 34.55
         L 69.02 55.9
         L 79.39 89.45
         L 50 70
         L 20.61 89.45
         L 30.98 55.9
         L 2.45 34.55
         L 38.24 33.82
         Z"
      fill="url(#starGradient)"
      stroke="#D4B86A"
      stroke-width="1.5"
      filter="url(#noise)"
    />
  </svg>
</template>

<style scoped>
.star-logo {
  filter: url(#drop);
}
</style>
