<script setup lang="ts">
import Logo from "@/components/Logo.vue";

const emit = defineEmits<{
  (e: "close"): void;
}>();

function close() {
  emit("close");
}
</script>

<template>
  <div class="splash">
    <div class="content">
      <!-- Bogen-Schrift -->
      <svg class="arc" viewBox="0 0 300 120" aria-hidden="true">
        <defs>
          <!-- Bogen oben: leicht nach unten geöffnet -->
          <path id="arcPath" d="M 40 95 Q 150 10 260 95" />
        </defs>

        <text class="arc-text">
          <textPath href="#arcPath" startOffset="50%" text-anchor="middle">
            *°⋆.ೃ❀࿔*Klick auf mich⋆❀.ೃ࿔*:･
          </textPath>
        </text>
      </svg>

      <!-- Klickbarer Bereich -->
      <button class="logoButton" type="button" @click="close" aria-label="Splash schließen">
        <Logo />
      </button>

    </div>
  </div>
</template>

<style scoped>
.splash {
  position: fixed;
  inset: 0;
  background: #461d3a;
  display: grid;
  place-items: center;
  z-index: 9999;
}

.content {
  display: grid;
  place-items: center;
  gap: 10px;
  padding: 24px;
  transform: translateY(-40px);
}

.arc {
  width: min(520px, 90vw);
  height: auto;
  margin-bottom: -30px;
  transform: translateY(-70px);
}

.arc-text {
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  fill: rgba(255, 255, 255, 0.92);
}

.logoButton {
  border: 0;
  background: transparent;
  padding: 0;
  cursor: pointer;
  border-radius: 12px;
  transform:scale(3.0);
}

/* Tastatur-Fokus */
.logoButton:focus-visible {
  outline: 3px solid rgba(255, 255, 255, 0.85);
  outline-offset: 10px;
}
</style>
