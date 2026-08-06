<template>
  <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full">
    <!-- Toolbar & Tabs -->
    <div class="border-b border-gray-100 bg-white">
      <div class="p-6 pb-0">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div class="relative flex-1 sm:max-w-md w-full">
            <Search class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input v-model="searchQuery" type="text" placeholder="Tìm kiếm theo tên người mượn, tên sách..." class="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1f3728]/20 focus:border-[#1f3728] font-medium">
          </div>
        </div>

        <!-- Tabs -->
        <div class="flex items-center gap-6 overflow-x-auto hide-scrollbar">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            @click="activeFilter = tab.value"
            :class="['pb-3 px-1 text-sm font-bold border-b-2 whitespace-nowrap flex items-center gap-2 transition-colors', activeFilter === tab.value ? 'text-[#1f3728] border-[#1f3728]' : 'text-gray-500 hover:text-[#1f3728] border-transparent hover:border-gray-200']"
          >
            {{ tab.label }}
            <span v-if="countByStatus(tab.value) > 0" :class="['py-0.5 px-2 rounded-full text-[10px]', tab.badgeClass]">
              {{ countByStatus(tab.value) }}
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- Loading / Error -->
    <div v-if="isLoading" class="flex-1 flex items-center justify-center text-gray-400 gap-2 py-16">
      <Loader2 class="w-5 h-5 animate-spin" />
      <span class="text-sm font-medium">Đang tải dữ liệu...</span>
    </div>
    <div v-else-if="errorMsg" class="flex-1 flex items-center justify-center text-red-500 text-sm font-medium py-16">{{ errorMsg }}</div>

    <!-- Table -->
    <div v-else class="overflow-x-auto flex-1">
      <table class="borrow-table w-full text-left border-collapse min-w-[950px]">
        <colgroup>
          <col class="reader-col">
          <col class="book-col">
          <col class="fee-col">
          <col class="date-col">
          <col class="date-col">
          <col class="status-col">
          <col class="actions-col">
        </colgroup>
        <thead class="sticky top-0 z-10 bg-gray-50/95 backdrop-blur-sm shadow-sm">
          <tr class="text-gray-500 text-xs uppercase tracking-wider">
            <th class="px-6 py-4 font-bold border-b border-gray-200">Độc giả</th>
            <th class="px-6 py-4 font-bold border-b border-gray-200">Sách mượn</th>
            <th class="px-6 py-4 font-bold border-b border-gray-200">Phí mượn / lượt</th>
            <th class="px-6 py-4 font-bold border-b border-gray-200">Ngày mượn</th>
            <th class="px-6 py-4 font-bold border-b border-gray-200">Hạn trả</th>
            <th class="px-6 py-4 font-bold text-center border-b border-gray-200">Trạng thái</th>
            <th class="action-column action-header px-2 py-4 font-bold text-center border-b border-gray-200">Thao tác</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 text-sm bg-white">
          <tr v-if="filteredBorrows.length === 0">
            <td colspan="7" class="px-6 py-12 text-center text-gray-400 text-sm font-medium">Không có phiếu mượn nào.</td>
          </tr>
          <tr
            v-for="borrow in paginatedBorrows"
            :key="borrow._id"
            :class="['hover:bg-blue-50/30 transition-colors group', borrow.status === 'overdue' ? 'bg-red-50/20' : '']"
          >
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                  {{ borrow.reader?.firstName?.charAt(0)?.toUpperCase() || '?' }}
                </div>
                <div>
                  <p class="font-bold text-[#1f3728]">{{ borrow.reader?.lastName }} {{ borrow.reader?.firstName }}</p>
                  <p class="text-[11px] text-gray-500">{{ borrow.reader?.email }}</p>
                </div>
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="borrow-book">
                <div class="borrow-cover">
                  <BookCover :src="borrow.book?.cover" :title="borrow.book?.title" :author="borrow.book?.author" />
                </div>
                <div class="min-w-0">
                  <p class="font-bold text-gray-700 line-clamp-2">{{ borrow.book?.title || 'Sách không còn trong hệ thống' }}</p>
                  <p class="text-[11px] text-gray-500 truncate">{{ borrow.book?.author || 'Không xác định' }}</p>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 text-xs font-medium text-gray-800">
              {{ borrow.book?.price ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(borrow.book.price) : '—' }}
            </td>
            <td class="px-6 py-4 text-gray-600 font-medium text-xs">
              {{ borrow.borrowDate ? new Date(borrow.borrowDate).toLocaleDateString('vi-VN') : '—' }}
            </td>
            <td class="px-6 py-4 text-xs" :class="borrow.status === 'overdue' ? 'text-red-600 font-bold' : 'text-gray-600 font-medium'">
              {{ borrow.dueDate ? new Date(borrow.dueDate).toLocaleDateString('vi-VN') : '—' }}
            </td>
            <td class="px-6 py-4 text-center">
              <span :class="['px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border flex items-center justify-center gap-1 w-max mx-auto', statusStyle(borrow.status)]">
                {{ statusLabel(borrow.status) }}
              </span>
            </td>
            <td class="action-column px-2 py-4">
              <div class="admin-row-actions flex items-center justify-center gap-1.5">
                <!-- Approve (pending) -->
                <button v-if="borrow.status === 'pending'" @click="handleApprove(borrow._id)" class="action-button approve" title="Phê duyệt" aria-label="Phê duyệt yêu cầu">
                  <Check class="w-4 h-4" />
                </button>
                <!-- Reject (pending) -->
                <button v-if="borrow.status === 'pending'" @click="handleCancel(borrow._id)" class="action-button reject" title="Từ chối" aria-label="Từ chối yêu cầu">
                  <X class="w-4 h-4" />
                </button>
                <button v-if="borrow.status === 'pending-return'" @click="handleConfirmReturn(borrow._id)" class="action-button approve" title="Xác nhận đã nhận sách" aria-label="Xác nhận đã nhận sách">
                  <Undo2 class="w-4 h-4" />
                </button>
                <span v-if="!['pending', 'pending-return'].includes(borrow.status)" class="processed-label" title="Đã xử lý" aria-label="Đã xử lý">
                  <CheckCircle2 class="w-4 h-4" />
                </span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <PaginationControls
      v-if="!isLoading && !errorMsg"
      v-model:page="currentPage"
      :total-items="filteredBorrows.length"
      :page-size="pageSize"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import {
  Search,
  Check,
  X,
  CheckCircle2,
  Undo2,
  Loader2
} from 'lucide-vue-next'
import { borrowService } from '@/services/borrow'
import BookCover from '@/components/books/BookCover.vue'
import PaginationControls from '@/components/admin/PaginationControls.vue'

const borrows = ref([])
const isLoading = ref(false)
const errorMsg = ref('')
const searchQuery = ref('')
const activeFilter = ref('all')
const currentPage = ref(1)
const pageSize = 10

const tabs = [
  { value: 'all', label: 'Tất cả phiếu mượn', badgeClass: 'bg-gray-100 text-gray-700' },
  { value: 'pending', label: 'Chờ duyệt', badgeClass: 'bg-yellow-100 text-yellow-700' },
  { value: 'borrowing', label: 'Đang mượn', badgeClass: 'bg-blue-100 text-blue-700' },
  { value: 'overdue', label: 'Quá hạn', badgeClass: 'bg-red-100 text-red-700' },
  { value: 'pending-return', label: 'Yêu cầu trả', badgeClass: 'bg-purple-100 text-purple-700' },
  { value: 'returned', label: 'Đã trả', badgeClass: 'bg-gray-100 text-gray-600' },
]

const countByStatus = (status) => {
  if (status === 'all') return 0
  return borrows.value.filter(b => b.status === status).length
}

const filteredBorrows = computed(() => {
  return borrows.value.filter(b => {
    const readerName = `${b.reader?.lastName ?? ''} ${b.reader?.firstName ?? ''}`.toLowerCase()
    const bookTitle = (b.book?.title ?? '').toLowerCase()
    const matchSearch = readerName.includes(searchQuery.value.toLowerCase()) || bookTitle.includes(searchQuery.value.toLowerCase())
    const matchFilter = activeFilter.value === 'all' || b.status === activeFilter.value
    return matchSearch && matchFilter
  })
})

const paginatedBorrows = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredBorrows.value.slice(start, start + pageSize)
})

watch([searchQuery, activeFilter], () => {
  currentPage.value = 1
})

watch(() => filteredBorrows.value.length, (total) => {
  currentPage.value = Math.min(currentPage.value, Math.max(1, Math.ceil(total / pageSize)))
})

const statusLabel = (status) => {
  const map = { pending: 'Chờ duyệt', borrowing: 'Đang mượn', 'pending-return': 'Chờ nhận lại', returned: 'Đã trả', overdue: 'Quá hạn', cancelled: 'Đã hủy' }
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

const loadBorrows = async () => {
  isLoading.value = true
  errorMsg.value = ''
  try {
    borrows.value = await borrowService.getAllBorrows()
  } catch (err) {
    errorMsg.value = err.message || 'Không thể tải dữ liệu.'
  } finally {
    isLoading.value = false
  }
}

const handleApprove = async (id) => {
  try {
    await borrowService.approveBorrowRequest(id)
    const b = borrows.value.find(x => x._id === id)
    if (b) b.status = 'borrowing'
    window.dispatchEvent(new CustomEvent('borrow-status-changed'))
  } catch (err) { alert(err.message) }
}

const handleCancel = async (id) => {
  if (!confirm('Từ chối yêu cầu mượn này?')) return
  try {
    await borrowService.cancelBorrowRequest(id)
    const b = borrows.value.find(x => x._id === id)
    if (b) b.status = 'cancelled'
    window.dispatchEvent(new CustomEvent('borrow-status-changed'))
  } catch (err) { alert(err.message) }
}

const handleConfirmReturn = async (id) => {
  if (!confirm('Xác nhận thư viện đã nhận lại sách này?')) return
  try {
    const response = await borrowService.confirmBookReturn(id)
    const index = borrows.value.findIndex(x => x._id === id)
    if (index !== -1) borrows.value[index] = { ...borrows.value[index], ...response.borrow }
    window.dispatchEvent(new CustomEvent('borrow-status-changed'))
  } catch (err) { alert(err.message) }
}

onMounted(loadBorrows)
</script>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

.borrow-table {
  table-layout: fixed;
}

.action-button {
  width: 30px;
  min-height: 30px;
  padding: 0;
  justify-content: center;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  border: 1px solid;
  border-radius: 9px;
  color: white;
  font-size: 11px;
  font-weight: 800;
  white-space: nowrap;
  box-shadow: none;
}
.action-button.approve { background: #17643d !important; border-color: #0f4d2d !important; color: #fff !important; }
.action-button.approve:hover { background: #0f4d2d !important; }
.action-button.reject { background: #a63d38 !important; border-color: #84302c !important; color: #fff !important; }
.action-button.reject:hover { background: #84302c !important; }

.action-column {
  width: 88px;
  min-width: 88px;
  max-width: 88px;
  background: #fff;
  border-left: 1px solid #e2e7e2;
}
.reader-col { width: 190px; }
.book-col { width: 180px; }
.fee-col { width: 130px; }
.date-col { width: 115px; }
.status-col { width: 125px; }
.actions-col { width: 88px; }
.action-header {
  background: #e8ede8;
  color: #263d30;
}
.processed-label {
  width: 30px;
  min-height: 30px;
  padding: 0;
  justify-content: center;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  border: 1px solid #cbd4cc;
  border-radius: 9px;
  background: #eef2ee;
  color: #53645a;
  font-size: 11px;
  font-weight: 800;
}

.borrow-table th,
.borrow-table td {
  vertical-align: middle;
  overflow: hidden;
}
.borrow-table th {
  white-space: nowrap;
}
.borrow-table td p {
  overflow: hidden;
  text-overflow: ellipsis;
}
.borrow-book {
  display: flex;
  align-items: center;
  gap: 10px;
}
.borrow-cover {
  width: 42px;
  height: 58px;
  flex: 0 0 auto;
  overflow: hidden;
  border: 1px solid #dfe3de;
  border-radius: 6px;
  background: #edf0eb;
  box-shadow: 0 3px 9px rgba(28,52,38,.1);
}
.admin-row-actions {
  min-width: 0;
  flex-wrap: nowrap;
}

@media (hover: none), (max-width: 900px) {
  .admin-row-actions {
    opacity: 1;
  }
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
