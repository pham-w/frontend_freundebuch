<script setup lang="ts">
import { ref, onMounted } from 'vue'
import FriendPage from './FriendPage.vue'
import BookCover from './BookCover.vue'
import BookControls from './BookControls.vue'

const pages = ref<any[]>([])
const pageIndex = ref(-1)
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    const res = await fetch("https://webtech-projekt-1-p0l3.onrender.com/seite")
    if (!res.ok) throw new Error("HTTP " + res.status)
    pages.value = await res.json()
  } catch (e: any) {
    error.value = e.message
  } finally {
    loading.value = false
  }
})

const next = () => pageIndex.value < pages.value.length - 1 && pageIndex.value++
const prev = () => pageIndex.value >= 0 && pageIndex.value--
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
    />

    <BookControls
      :hasPrev="pageIndex >= 0"
      :hasNext="pageIndex < pages.length - 1"
      @next="next"
      @prev="prev"
    />
  </div>
</template>
