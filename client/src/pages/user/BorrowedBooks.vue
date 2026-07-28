<template>
  <div class="p-6 max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold text-[#1f3728] mb-6">Sách đã mượn của tôi</h1>

    <!-- Filter tabs -->
    <div class="flex gap-2 flex-wrap mb-6">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        @click="activeFilter = tab.value"
        :class="['px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors', activeFilter === tab.value ? 'bg-[#1f3728] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200']"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="flex items-center justify-center py-16 text-gray-400 gap-2">
      <Loader2 class="w-5 h-5 animate-spin" />
      <span class="text-sm">Đang tải...</span>
    </div>

    <!-- Empty -->
    <div v-else-if="filteredBorrows.length === 0" class="text-center py-16 text-gray-400">
      <BookOpen class="w-12 h-12 mx-auto mb-3 opacity-30" />
      <p class="text-sm font-medium">Chưa có phiếu mượn nào.</p>
    </div>

    <!-- List -->
    <div v-else class="space-y-3">
      <div
        v-for="borrow in filteredBorrows"
        :key="borrow._id"
        class="bg-white border border-gray-200 rounded-xl p-4 flex gap-4 items-center shadow-sm hover:shadow-md transition-shadow"
      >
        <!-- Book cover -->
        <img
          v-if="borrow.book?.cover"
          :src="borrow.book.cover"
          :alt="borrow.book.title"
          class="w-14 h-20 object-cover rounded-lg shadow-sm flex-shrink-0"
        />
        <div v-else class="w-14 h-20 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center">
          <BookOpen class="w-6 h-6 text-gray-300" />
        </div>

        <!-- Info -->
        <div class="flex-1 min-w-0">
          <p class="font-bold text-[#1f3728] text-sm line-clamp-1">{{ borrow.book?.title || 'Không xác định' }}</p>
          <p class="text-xs text-gray-500 mt-0.5">{{ borrow.book?.author }}</p>
          <div class="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
            <span v-if="borrow.borrowDate">📅 Mượn: {{ new Date(borrow.borrowDate).toLocaleDateString('vi-VN') }}</span>
            <span v-if="borrow.dueDate" :class="isOverdue(borrow) ? 'text-red-600 font-bold' : ''">
              ⏰ Hạn trả: {{ new Date(borrow.dueDate).toLocaleDateString('vi-VN') }}
            </span>
            <span v-if="borrow.returnDate">✅ Đã trả: {{ new Date(borrow.returnDate).toLocaleDateString('vi-VN') }}</span>
          </div>
        </div>

        <!-- Status & Actions -->
        <div class="flex flex-col items-end gap-2 flex-shrink-0">
          <span :class="['px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border', statusStyle(borrow.status)]">
            {{ statusLabel(borrow.status) }}
          </span>
          <button
            v-if="borrow.status === 'pending'"
            @click="handleCancel(borrow._id)"
            class="text-[11px] text-red-600 hover:text-red-800 font-bold transition-colors"
          >
            Hủy yêu cầu
          </button>
          <button
            v-if="borrow.status === 'borrowing' || borrow.status === 'overdue'"
            @click="handleRequestReturn(borrow._id)"
            class="text-[11px] text-blue-600 hover:text-blue-800 font-bold transition-colors"
          >
            Yêu cầu trả
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { BookOpen, Loader2 } from 'lucide-vue-next'
import { borrowService } from '@/services/borrow'

const myBorrows = ref([])
const isLoading = ref(false)
const activeFilter = ref('all')

const tabs = [
  { value: 'all', label: 'Tất cả' },
  { value: 'pending', label: 'Chờ duyệt' },
  { value: 'borrowing', label: 'Đang mượn' },
  { value: 'overdue', label: 'Quá hạn' },
  { value: 'pending-return', label: 'Chờ trả' },
  { value: 'returned', label: 'Đã trả' },
]

const filteredBorrows = computed(() => {
  if (activeFilter.value === 'all') return myBorrows.value
  return myBorrows.value.filter(b => b.status === activeFilter.value)
})

const isOverdue = (borrow) => borrow.status === 'overdue'

const statusLabel = (status) => {
  const map = { pending: 'Chờ duyệt', borrowing: 'Đang mượn', 'pending-return': 'Chờ trả', returned: 'Đã trả', overdue: 'Quá hạn', cancelled: 'Đã hủy' }
  return map[status] || status
}
const statusStyle = (status) => {
  const map = {
    pending: 'bg-yellow-100/50 border-yellow-200 text-yellow-700',
    borrowing: 'bg-blue-100/50 border-blue-200 text-blue-700',
    'pending-return': 'bg-purple-100/50 border-purple-200 text-purple-700',
    returned: 'bg-gray-100/50 border-gray-200 text-gray-600',
    overdue: 'bg-red-100/50 border-red-200 text-red-700',
    cancelled: 'bg-gray-100/50 border-gray-200 text-gray-400',
  }
  return map[status] || ''
}

const loadMyBorrows = async () => {
  isLoading.value = true
  try {
    myBorrows.value = await borrowService.getMyBorrows()
  } catch (err) {
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

const handleCancel = async (id) => {
  if (!confirm('Hủy yêu cầu mượn này?')) return
  try {
    await borrowService.cancelBorrowRequest(id)
    const b = myBorrows.value.find(x => x._id === id)
    if (b) b.status = 'cancelled'
  } catch (err) { alert(err.message) }
}

const handleRequestReturn = async (id) => {
  try {
    await borrowService.requestReturnBook(id)
    const b = myBorrows.value.find(x => x._id === id)
    if (b) b.status = 'pending-return'
  } catch (err) { alert(err.message) }
}

onMounted(loadMyBorrows)
</script>
