<template>
  <div class="generated-cover" :style="{ '--cover-accent': accent }" role="img" :aria-label="`Bìa sách ${displayTitle}`">
    <span class="brand">SPACESOUL LIBRARY</span>
    <div class="ornament">✦</div>
    <strong :title="displayTitle">{{ displayTitle }}</strong>
    <small :title="displayAuthor">{{ displayAuthor }}</small>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: { type: String, default: 'Tủ sách Spacesoul' },
  author: { type: String, default: 'Đang cập nhật tác giả' }
})

const palettes = ['#b7833e', '#617a66', '#9a5f4b', '#526b83', '#79658b', '#8b7746']
const displayTitle = computed(() => (props.title || 'Tủ sách Spacesoul').normalize('NFC'))
const displayAuthor = computed(() => (props.author || 'Đang cập nhật tác giả').normalize('NFC'))
const accent = computed(() => {
  const value = [...displayTitle.value].reduce((sum, char) => sum + char.charCodeAt(0), 0)
  return palettes[value % palettes.length]
})
</script>

<style scoped>
.generated-cover {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 100%;
  padding: 12% 10%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
  background: linear-gradient(145deg, #173b2b 0%, #244f39 65%, var(--cover-accent) 160%);
  color: #fff;
  text-align: center;
  box-shadow: inset 8px 0 18px rgba(0, 0, 0, .14);
  font-family: "Be Vietnam Pro", "Segoe UI", Arial, sans-serif;
  text-rendering: optimizeLegibility;
}

.generated-cover::before {
  content: "";
  position: absolute;
  inset: 7%;
  border: 1px solid rgba(231, 203, 140, .42);
  pointer-events: none;
}

.brand {
  color: #e7cb8c;
  font-size: clamp(7px, .55vw, 10px);
  font-weight: 800;
  letter-spacing: .16em;
}

.ornament {
  margin: auto 0;
  color: #e7cb8c;
  font-size: 1rem;
}

strong,
small {
  max-width: 100%;
  font-family: "Be Vietnam Pro", "Segoe UI", Arial, sans-serif;
  overflow-wrap: normal;
  word-break: normal;
}

strong {
  font-size: clamp(.82rem, 1.35vw, 1.3rem);
  font-weight: 800;
  line-height: 1.35;
  hyphens: none;
}

small {
  color: rgba(255, 255, 255, .72);
  font-size: clamp(.58rem, .8vw, .75rem);
  line-height: 1.4;
}

@container (max-width: 120px) {
  .generated-cover { padding: 10px 7px; }
  .generated-cover::before { inset: 5px; }
  .brand { font-size: 5px; letter-spacing: .08em; }
  .ornament { margin: 5px 0; font-size: .6rem; }
  strong,
  small {
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
  }
  strong { font-size: 9px; line-height: 1.35; -webkit-line-clamp: 4; }
  small { font-size: 6px; line-height: 1.3; -webkit-line-clamp: 2; }
}

@container (max-width: 60px) {
  .generated-cover { padding: 6px 4px; }
  .brand { font-size: 4px; }
  .ornament,
  small { display: none; }
  strong { font-size: 6px; line-height: 1.25; -webkit-line-clamp: 5; }
}
</style>
