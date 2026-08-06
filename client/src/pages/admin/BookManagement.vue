<template>
  <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full">
    <!-- Toolbar -->
    <div class="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white">
      <div class="flex items-center gap-4 w-full sm:w-auto">
        <div class="relative flex-1 sm:w-64">
          <Search class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" v-model="searchQuery" placeholder="Tìm kiếm sách..." class="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1f3728]/20 focus:border-[#1f3728] font-medium">
        </div>
      </div>
      <button @click="openAddModal" class="w-full sm:w-auto bg-[#1f3728] text-white px-5 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#16241c] transition-colors shadow-sm">
        <Plus class="w-4 h-4" /> Thêm sách mới
      </button>
    </div>

    <!-- Table -->
    <div class="admin-table-wrap overflow-x-auto flex-1">
      <table class="book-admin-table w-full text-left border-collapse min-w-[1080px]">
        <thead class="sticky top-0 z-10 bg-gray-50/95 backdrop-blur-sm shadow-sm">
          <tr class="text-gray-500 text-xs uppercase tracking-wider">
            <th class="px-6 py-4 font-bold border-b border-gray-200">Sách</th>
            <th class="px-6 py-4 font-bold border-b border-gray-200">Tác giả</th>
            <th class="px-6 py-4 font-bold border-b border-gray-200">Nhà XB / Năm XB</th>
            <th class="px-6 py-4 font-bold border-b border-gray-200">Phí mượn / lượt</th>
            <th class="px-6 py-4 font-bold text-center border-b border-gray-200">Tồn kho</th>
            <th class="px-6 py-4 font-bold text-center border-b border-gray-200">Trạng thái</th>
            <th class="action-column-header px-5 py-4 font-bold text-center border-b border-gray-200">Thao tác</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 text-sm bg-white">
          <tr v-for="book in paginatedBooks" :key="book._id" class="hover:bg-blue-50/30 transition-colors group">
            <td class="px-6 py-4">
              <div class="flex items-center gap-4">
                <div class="w-10 h-14 rounded-md bg-gray-200 overflow-hidden shadow-sm flex-shrink-0">
                  <BookCover :src="book.cover" :title="book.title" :author="book.author" />
                </div>
                <div>
                  <p class="font-bold text-[#1f3728] group-hover:text-blue-700 transition-colors cursor-pointer line-clamp-1">{{ book.title }}</p>
                  <p class="text-[11px] text-gray-500 mt-0.5">Thể loại: {{ categoryLabel(book.category) }}</p>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 text-gray-600 font-medium">{{ book.author }}</td>
            <td class="px-6 py-4">
              <div class="text-sm font-medium text-gray-700">{{ book.publisher?.name || 'N/A' }}</div>
              <div class="text-[11px] text-gray-500">{{ book.publishYear }}</div>
            </td>
            <td class="px-6 py-4 font-medium text-gray-800">
              {{ formatCurrency(book.price) }}
            </td>
            <td class="px-6 py-4 text-center font-bold" :class="book.availableCopies > 0 ? 'text-[#1f3728]' : 'text-red-600'">
              {{ book.availableCopies }}/{{ book.totalCopies }}
            </td>
            <td class="px-6 py-4 text-center">
              <span v-if="book.availableCopies > 0" class="bg-green-100/50 border border-green-200 text-green-700 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">Sẵn có</span>
              <span v-else class="bg-orange-100/50 border border-orange-200 text-orange-700 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">Đã mượn hết</span>
            </td>
            <td class="action-column-cell px-5 py-4">
              <div class="admin-row-actions flex items-center justify-end gap-2">
                <button @click="openEditModal(book)" class="row-action edit-action" title="Chỉnh sửa sách" aria-label="Chỉnh sửa sách">
                  <Edit2 class="w-4 h-4" />
                </button>
                <button @click="deleteBook(book._id)" class="row-action delete-action" title="Xóa sách" aria-label="Xóa sách">
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="filteredBooks.length === 0">
            <td colspan="7" class="px-6 py-8 text-center text-gray-500">
              Không tìm thấy sách nào.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <PaginationControls
      v-model:page="currentPage"
      :total-items="filteredBooks.length"
      :page-size="pageSize"
    />

    <!-- Modal Form -->
    <div v-if="showModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div class="book-modal-header p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 class="text-xl font-bold text-[#1f3728]">{{ isEdit ? 'Cập nhật sách' : 'Thêm sách mới' }}</h2>
          <button @click="closeModal" class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"><X class="w-5 h-5" /></button>
        </div>
        <div class="book-modal-body p-6 overflow-y-auto flex-1">
          <form @submit.prevent="saveBook" class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tên sách <span class="text-red-500">*</span></label>
                <input v-model="form.title" type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1f3728]/20 focus:border-[#1f3728] transition-colors">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tác giả <span class="text-red-500">*</span></label>
                <input v-model="form.author" type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1f3728]/20 focus:border-[#1f3728] transition-colors">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Thể loại <span class="text-red-500">*</span></label>
                <select v-model="form.category" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1f3728]/20 focus:border-[#1f3728] transition-colors bg-white">
                  <option value="" disabled>Chọn thể loại</option>
                  <option v-for="category in CATEGORY_OPTIONS" :key="category.value" :value="category.value">{{ category.label }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Đơn giá (VNĐ) <span class="text-red-500">*</span></label>
                <input v-model.number="form.price" type="number" min="0" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1f3728]/20 focus:border-[#1f3728] transition-colors">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nhà xuất bản <span class="text-red-500">*</span></label>
                <select v-model="form.publisher" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1f3728]/20 focus:border-[#1f3728] transition-colors bg-white">
                  <option value="" disabled>Chọn nhà xuất bản</option>
                  <option v-for="pub in publishers" :key="pub._id" :value="pub._id">{{ pub.name }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Năm xuất bản <span class="text-red-500">*</span></label>
                <input v-model.number="form.publishYear" type="number" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1f3728]/20 focus:border-[#1f3728] transition-colors">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tổng số sách <span class="text-red-500">*</span></label>
                <input v-model.number="form.totalCopies" type="number" min="1" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1f3728]/20 focus:border-[#1f3728] transition-colors">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Sách có sẵn <span class="text-red-500">*</span></label>
                <input v-model.number="form.availableCopies" type="number" min="0" :max="form.totalCopies" required :disabled="!isEdit" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1f3728]/20 focus:border-[#1f3728] transition-colors disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed">
                <p v-if="!isEdit" class="mt-1 text-[11px] text-gray-500">Tự động bằng tổng số sách khi thêm mới.</p>
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Ảnh bìa (URL)</label>
              <input v-model="form.cover" type="text" placeholder="https://..." class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1f3728]/20 focus:border-[#1f3728] transition-colors">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
              <textarea v-model="form.description" rows="3" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1f3728]/20 focus:border-[#1f3728] transition-colors resize-none"></textarea>
            </div>
          </form>
        </div>
        <div class="book-modal-footer p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button @click="closeModal" class="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors">Hủy</button>
          <button @click="saveBook" class="px-5 py-2.5 bg-[#1f3728] text-white font-bold rounded-lg hover:bg-[#16241c] transition-colors shadow-sm">
            {{ isEdit ? 'Cập nhật' : 'Thêm sách' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { Search, Plus, Edit2, Trash2, X } from 'lucide-vue-next'
import { bookService } from '@/services/book'
import BookCover from '@/components/books/BookCover.vue'
import PaginationControls from '@/components/admin/PaginationControls.vue'
import publisherService from '@/services/publisher'
import { CATEGORY_OPTIONS, categoryLabel, normalizeCategory } from '@/utils/categories'

const books = ref([])
const publishers = ref([])
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = 10
const showModal = ref(false)
const isEdit = ref(false)
const editingId = ref(null)

const form = ref({
  title: '',
  author: '',
  category: '',
  price: 0,
  publisher: '',
  publishYear: new Date().getFullYear(),
  totalCopies: 1,
  availableCopies: 1,
  cover: '',
  description: ''
})

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0)
}

const loadData = async () => {
  try {
    const [booksRes, pubRes] = await Promise.all([
      bookService.getBooks(),
      publisherService.getPublishers()
    ])
    books.value = Array.isArray(booksRes) ? booksRes : (booksRes.data || [])
    publishers.value = Array.isArray(pubRes) ? pubRes : (pubRes.data || [])
  } catch (error) {
    console.error('Lỗi khi tải dữ liệu:', error)
  }
}

const filteredBooks = computed(() => {
  if (!searchQuery.value) return books.value
  const q = searchQuery.value.toLowerCase()
  return books.value.filter(b => 
    b.title.toLowerCase().includes(q) || 
    b.author.toLowerCase().includes(q) ||
    b.category.toLowerCase().includes(q)
  )
})

const paginatedBooks = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredBooks.value.slice(start, start + pageSize)
})

watch(searchQuery, () => {
  currentPage.value = 1
})

watch(() => filteredBooks.value.length, (total) => {
  currentPage.value = Math.min(currentPage.value, Math.max(1, Math.ceil(total / pageSize)))
})

watch(() => form.value.totalCopies, (total) => {
  if (!isEdit.value) {
    form.value.availableCopies = Math.max(1, Math.trunc(Number(total) || 1))
  }
})

const openAddModal = () => {
  isEdit.value = false
  editingId.value = null
  form.value = {
    title: '',
    author: '',
    category: '',
    price: 0,
    publisher: publishers.value.length > 0 ? publishers.value[0]._id : '',
    publishYear: new Date().getFullYear(),
    totalCopies: 1,
    availableCopies: 1,
    cover: '',
    description: ''
  }
  showModal.value = true
}

const openEditModal = (book) => {
  isEdit.value = true
  editingId.value = book._id
  form.value = {
    title: book.title,
    author: book.author,
    category: normalizeCategory(book.category),
    price: book.price,
    publisher: book.publisher ? book.publisher._id : '',
    publishYear: book.publishYear,
    totalCopies: book.totalCopies,
    availableCopies: book.availableCopies,
    cover: book.cover || '',
    description: book.description || ''
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const saveBook = async () => {
  try {
    if (isEdit.value) {
      await bookService.updateBook(editingId.value, form.value)
    } else {
      await bookService.createBook({
        ...form.value,
        availableCopies: form.value.totalCopies,
      })
    }
    closeModal()
    await loadData()
  } catch (error) {
    console.error('Lỗi khi lưu sách:', error)
    alert(error.message || 'Có lỗi xảy ra khi lưu sách!')
  }
}

const deleteBook = async (id) => {
  if (confirm('Bạn có chắc chắn muốn xóa sách này?')) {
    try {
      await bookService.deleteBook(id)
      await loadData()
    } catch (error) {
      console.error('Lỗi khi xóa sách:', error)
      alert(error.message || 'Có lỗi xảy ra khi xóa sách!')
    }
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.row-action {
  width: 32px;
  min-height: 32px;
  padding: 0;
  justify-content: center;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  border: 1px solid;
  border-radius: 9px;
  font-size: 11px;
  font-weight: 800;
  white-space: nowrap;
  box-shadow: none;
}
.edit-action { border-color: #285b85; background: #315f87; color: #fff; }
.edit-action:hover { background: #244b6d; }
.delete-action { border-color: #84302c; background: #a63d38; color: #fff; }
.delete-action:hover { background: #84302c; }

.book-admin-table th,
.book-admin-table td {
  vertical-align: middle;
}
.book-admin-table th {
  white-space: nowrap;
}
.book-admin-table th:last-child,
.book-admin-table td:last-child {
  width: 112px;
  min-width: 112px;
}
.admin-row-actions {
  justify-content: center;
  flex-wrap: nowrap;
}
.action-column-header { background: #e8ede8; color: #263d30; }
.action-column-cell { border-left: 1px solid #e2e7e2; background: #fff; }

@media (hover: none), (max-width: 900px) {
  .admin-row-actions {
    opacity: 1;
  }
}

@media (max-width: 560px) {
  .book-modal-header,
  .book-modal-body,
  .book-modal-footer {
    padding: 16px;
  }

  .book-modal-header h2 {
    font-size: 1rem;
  }

  .book-modal-footer {
    flex-direction: column-reverse;
  }

  .book-modal-footer button {
    width: 100%;
  }
}

@media (max-width: 767px) {
  .admin-table-wrap { overflow: visible; padding: 10px; background: #f4f6f2; }
  .book-admin-table { min-width: 0; display: block; }
  .book-admin-table thead { display: none; }
  .book-admin-table tbody { display: grid; gap: 12px; }
  .book-admin-table tr { display: block; overflow: hidden; border: 1px solid #dfe5de; border-radius: 14px; background: #fff; box-shadow: 0 5px 16px rgba(25,48,34,.05); }
  .book-admin-table td { width: 100% !important; min-width: 0 !important; padding: 10px 13px; display: grid; grid-template-columns: 96px minmax(0,1fr); align-items: center; gap: 10px; border: 0; border-bottom: 1px solid #edf0eb; text-align: left !important; }
  .book-admin-table td::before { color: #7b877e; font-size: .62rem; font-weight: 800; letter-spacing: .04em; text-transform: uppercase; }
  .book-admin-table td:nth-child(1)::before { content: "Sách"; }
  .book-admin-table td:nth-child(2)::before { content: "Tác giả"; }
  .book-admin-table td:nth-child(3)::before { content: "NXB / Năm"; }
  .book-admin-table td:nth-child(4)::before { content: "Phí mượn"; }
  .book-admin-table td:nth-child(5)::before { content: "Tồn kho"; }
  .book-admin-table td:nth-child(6)::before { content: "Trạng thái"; }
  .book-admin-table td:nth-child(7)::before { content: "Thao tác"; }
  .book-admin-table td:first-child { padding-top: 14px; }
  .book-admin-table td:last-child { border-bottom: 0; }
  .book-admin-table td[colspan] { display: block; padding: 28px 14px; text-align: center !important; }
  .book-admin-table td[colspan]::before { display: none; }
  .admin-row-actions { justify-content: flex-start; }
}
</style>
