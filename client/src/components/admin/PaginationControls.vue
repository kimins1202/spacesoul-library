<template>
  <div
    v-if="totalItems > 0"
    class="flex flex-col items-center gap-4 border-t border-gray-100 bg-white px-6 py-5 sm:flex-row sm:justify-between"
  >
    <p class="text-sm font-medium text-gray-500">
      Hiển thị <span class="font-bold text-[#1f3728]">{{ startItem }}–{{ endItem }}</span>
      trong <span class="font-bold text-[#1f3728]">{{ totalItems }}</span> kết quả
    </p>

    <div v-if="totalPages > 1" class="flex items-center justify-center gap-2">
      <button
        type="button"
        :disabled="page <= 1"
        aria-label="Trang trước"
        class="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition-colors hover:border-[#1f3728] hover:text-[#1f3728] disabled:cursor-not-allowed disabled:opacity-40"
        @click="$emit('update:page', page - 1)"
      >
        <ChevronLeft class="h-4 w-4" />
      </button>

      <button
        v-for="pageNumber in visiblePages"
        :key="pageNumber"
        type="button"
        :class="[
          'flex h-10 w-10 items-center justify-center rounded-xl border text-sm font-bold transition-colors',
          pageNumber === page
            ? 'border-[#1f3728] bg-[#1f3728] text-white shadow-sm'
            : 'border-gray-200 bg-white text-gray-600 hover:border-[#1f3728] hover:text-[#1f3728]'
        ]"
        @click="$emit('update:page', pageNumber)"
      >
        {{ pageNumber }}
      </button>

      <button
        type="button"
        :disabled="page >= totalPages"
        aria-label="Trang sau"
        class="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition-colors hover:border-[#1f3728] hover:text-[#1f3728] disabled:cursor-not-allowed disabled:opacity-40"
        @click="$emit('update:page', page + 1)"
      >
        <ChevronRight class="h-4 w-4" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const props = defineProps({
  page: { type: Number, required: true },
  totalItems: { type: Number, required: true },
  pageSize: { type: Number, default: 10 }
})

defineEmits(['update:page'])

const totalPages = computed(() => Math.max(1, Math.ceil(props.totalItems / props.pageSize)))
const startItem = computed(() => (props.page - 1) * props.pageSize + 1)
const endItem = computed(() => Math.min(props.page * props.pageSize, props.totalItems))

const visiblePages = computed(() => {
  if (totalPages.value <= 5) {
    return Array.from({ length: totalPages.value }, (_, index) => index + 1)
  }
  const start = Math.min(Math.max(props.page - 2, 1), totalPages.value - 4)
  return Array.from({ length: 5 }, (_, index) => start + index)
})
</script>
