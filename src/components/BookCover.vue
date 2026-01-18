<template>
  <div class="cover" role="button" tabindex="0">
    <div class="inner">
      <div class="badge">Mein Freundebuch</div>

      <h1>Mein Freundebuch</h1>

      <div class="hint">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </div>
    </div>

    <!-- "Buchrücken" -->
    <div class="spine" aria-hidden="true"></div>
  </div>
</template>

<style scoped>
/* Cover als "Buch" */
.cover {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 22px;
  background: linear-gradient(135deg, #0b1220 0%, #0f1d38 45%, #0b1220 100%);
  border: 1px solid rgba(255,255,255,0.10);
  box-shadow:
    0 22px 60px rgba(0,0,0,0.55),
    inset 0 1px 0 rgba(255,255,255,0.06);
  display: grid;
  place-items: center;
  overflow: hidden;
}


/* leichter "Glanz" */
.cover::before {
  content: "";
  position: absolute;
  inset: -40% -20%;
  background: radial-gradient(circle at 30% 20%, rgba(37,99,235,0.22), transparent 55%);
  transform: rotate(10deg);
}

/* feines Muster */
.cover::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px);
  background-size: 18px 18px;
  opacity: 0.18;
  pointer-events: none;
}

.inner {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 26px 28px;
  color: #e5e7eb;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;

  padding: 8px 12px;
  border-radius: 999px;

  background: rgba(17,24,39,0.65);
  border: 1px solid rgba(255,255,255,0.10);
  color: #dbeafe;

  font-weight: 700;
  font-size: 0.9rem;
  letter-spacing: 0.2px;

  margin-bottom: 18px;
}

h1 {
  margin: 0;
  font-size: 2.1rem;
  letter-spacing: 0.2px;
}

p {
  margin: 10px 0 0;
  opacity: 0.9;
  font-size: 1rem;
}

p span {
  color: #93c5fd;
  font-weight: 700;
}

/* kleine Punkte als "Weiter" Hinweis */
.hint {
  margin-top: 18px;
  display: inline-flex;
  gap: 8px;
  opacity: 0.8;
}

.dot {
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: rgba(255,255,255,0.45);
}

/* Buchrücken links */
.spine {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 34px;

  background: linear-gradient(180deg, #060b16 0%, #0b1220 100%);
  border-right: 1px solid rgba(255,255,255,0.08);
  box-shadow: inset -10px 0 18px rgba(0,0,0,0.35);

  z-index: 3;
}

/* responsive: etwas niedriger */
@media (max-width: 700px) {
  .cover {
    height: 260px;
  }
  h1 {
    font-size: 1.8rem;
  }
}
</style>
