<template>
  <div class="book-cover">
    <BookCoverFallback :title="title" :author="author" />
    <img
      v-if="src && !failed"
      :src="src"
      :alt="`Bìa sách ${title}`"
      loading="lazy"
      @error="failed = true"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import BookCoverFallback from './BookCoverFallback.vue'

const props = defineProps({
  src: { type: String, default: '' },
  title: { type: String, default: 'Tủ sách Spacesoul' },
  author: { type: String, default: 'Đang cập nhật tác giả' }
})

const failed = ref(false)
watch(() => props.src, () => { failed.value = false })
</script>

<style scoped>
.book-cover {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  container-type: inline-size;
}

.book-cover > img {
  position: absolute;
  z-index: 1;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
