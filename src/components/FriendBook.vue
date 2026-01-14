<script setup lang="ts">
import { ref, onMounted } from 'vue'
import FriendPage from './FriendPage.vue'
import BookCover from './BookCover.vue'
import BookControls from './BookControls.vue'

const API_BASE = "https://webtech-projekt-1-p0l3.onrender.com"

const pages = ref<any[]>([])
const pageIndex = ref(-1)
const loading = ref(true)
const error = ref<string | null>(null)

async function loadPages() {
  loading.value = true
  error.value = null

  try {
    const res = await fetch(`${API_BASE}/seite`)
    if (!res.ok) throw new Error("HTTP " + res.status)
    const data = await res.json()
    // nach ID sortieren
    pages.value = data.sort((a: any, b: any) => a.id - b.id)
  } catch (e: any) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

onMounted(loadPages)

const next = () => pageIndex.value < pages.value.length - 1 && pageIndex.value++
const prev = () => pageIndex.value >= 0 && pageIndex.value--

// 🗑 Löschen eines Eintrags
async function deleteEntry(id: number) {
  const confirmed = window.confirm("Willst du diesen Eintrag wirklich löschen?")
  if (!confirmed) return

  try {
    const res = await fetch(`${API_BASE}/seite/${id}`, {
      method: "DELETE",
    })
    if (!res.ok) {
      const text = await res.text()
      throw new Error(`HTTP ${res.status}: ${text}`)
    }

    // lokal entfernen
    pages.value = pages.value.filter(p => p.id !== id)

    // pageIndex korrigieren, damit wir nicht „ins Leere“ zeigen
    if (pages.value.length === 0) {
      pageIndex.value = -1
    } else if (pageIndex.value >= pages.value.length) {
      pageIndex.value = pages.value.length - 1
    }
  } catch (e: any) {
    window.alert("Löschen fehlgeschlagen: " + (e?.message ?? e))
  }
}
</script>

<template>
  <div>
    <p v-if="loading">Lade Freundebuch…</p>
    <p v-if="error">Fehler: {{ error }}</p>

    <BookCover v-if="pageIndex < 0" />

    <FriendPage
      v-for="(p, i) in pages"
      :key="p.id"
      :person="p"
      :visible="i === pageIndex"
      @deleted="deleteEntry"
    />

    <BookControls
      :hasPrev="pageIndex >= 0"
      :hasNext="pageIndex < pages.length - 1"
      @next="next"
      @prev="prev"
    />
  </div>
</template>
