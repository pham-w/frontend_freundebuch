<script setup lang="ts">
/* keine Logik notwendig */
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
      <!-- ⭐ Gradient -->
      <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#F5E6A8" />
        <stop offset="50%" stop-color="#F0DC8E" />
        <stop offset="100%" stop-color="#E8D078" />
      </linearGradient>

      <!-- ✨ Noise -->
      <filter id="noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" />
        <feColorMatrix type="saturate" values="0" />
        <feBlend mode="multiply" in="SourceGraphic" />
      </filter>

      <!-- 🌑 Shadow -->
      <filter id="drop" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="rgba(0,0,0,0.15)" />
      </filter>

      <!-- ⭕ Kreis-Clip für Glitzer -->
      <clipPath id="circleClip">
        <circle cx="50" cy="50" r="46" />
      </clipPath>
    </defs>

    <!-- ⭕ Kreisförmiger Glitzer-Hintergrund -->
    <circle
      cx="50"
      cy="50"
      r="46"
      fill="rgba(255,255,255,0.05)"
    />

    <!-- ⭐ Stern -->
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

    <!-- 👀 Augen -->
    <ellipse cx="38" cy="45" rx="2.5" ry="6" fill="#5C3A21" />
    <ellipse cx="62" cy="45" rx="2.5" ry="6" fill="#5C3A21" />

    <!-- 😊 Wangen -->
    <ellipse class="blush" cx="28" cy="52" rx="6" ry="4" fill="#FF9999" />
    <ellipse class="blush" cx="72" cy="52" rx="6" ry="4" fill="#FF9999" />

    <!-- 😊 Mund (enger & süß) -->
    <path
      class="mouth-normal"
      d="M 46 58 Q 50 60 54 58"
      stroke="#5C3A21"
      stroke-width="2"
      stroke-linecap="round"
      fill="none"
    />
    <path
      class="mouth-hover"
      d="M 45.5 58 Q 50 61 54.5 58"
      stroke="#5C3A21"
      stroke-width="2"
      stroke-linecap="round"
      fill="none"
    />

    <!-- ✨ Sparkles – auf Kreis begrenzt -->
    <g clip-path="url(#circleClip)">
      <circle class="sparkle" cx="15" cy="20" r="2" fill="#FFFFFF" />
      <circle class="sparkle" cx="85" cy="30" r="1.5" fill="#FFFFFF" />
      <circle class="sparkle" cx="20" cy="70" r="1.5" fill="#FFFFFF" />
    </g>
  </svg>
</template>

<style scoped>
.star-logo {
  cursor: default;
  filter: url(#drop);
  transform-origin: 50% 50%;
  transition: transform 280ms ease, translate 280ms ease;
}
.star-logo:hover {
  transform: rotate(2deg);
  translate: 0 -2px;
}

/* Mund-Hover */
.mouth-hover { opacity: 0; transition: opacity 200ms ease; }
.mouth-normal { opacity: 1; transition: opacity 200ms ease; }
.star-logo:hover .mouth-hover { opacity: 1; }
.star-logo:hover .mouth-normal { opacity: 0; }

/* Wangen */
.blush { opacity: 0.6; transition: opacity 200ms ease; }
.star-logo:hover .blush { opacity: 0.8; }

/* Sparkles */
.sparkle { opacity: 0; transition: opacity 200ms ease; }
.star-logo:hover .sparkle { opacity: 1; }
</style>
