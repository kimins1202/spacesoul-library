<template>
  <div class="bg-[#fbfbfb] min-h-[calc(100vh-80px-300px)] py-12">
    <div class="max-w-7xl mx-auto px-6">
      <!-- Header -->
      <div class="mb-10 text-center md:text-left border-b border-gray-200 pb-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 class="text-3xl md:text-4xl font-bold font-title text-[#1f3728] mb-2 tracking-tight">Danh mục Sách</h1>
          <p class="text-gray-500 text-sm md:text-base font-medium">Khám phá và tra cứu toàn bộ tài liệu trong thư viện Spacesoul.</p>
        </div>
        <div class="w-full md:w-96">
          <!-- Search Bar -->
          <div class="bg-white rounded-xl border border-gray-200 p-1.5 shadow-sm flex items-center relative overflow-hidden transition-all focus-within:border-[#1f3728] focus-within:ring-1 focus-within:ring-[#1f3728]">
            <Search class="w-5 h-5 text-gray-400 absolute left-4" />
            <input v-model="searchQuery" type="text" placeholder="Tìm tên sách, tác giả..." class="w-full bg-transparent border-none outline-none pl-11 pr-4 py-2.5 text-sm font-medium text-gray-700" />
            <button class="bg-[#1f3728] text-white px-4 py-2.5 rounded-lg text-xs font-bold hover:bg-[#121c15] transition-colors ml-1">Tìm</button>
          </div>
        </div>
      </div>

      <div class="flex flex-col lg:flex-row gap-10">
        <!-- Sidebar Filter -->
        <aside class="w-full lg:w-64 flex-shrink-0">
          <div class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm sticky top-28">
            <div class="flex items-center gap-2 mb-6">
              <Filter class="w-4 h-4 text-[#1f3728]" />
              <h3 class="font-bold text-[#1f3728] text-sm uppercase tracking-wider">Bộ lọc tìm kiếm</h3>
            </div>
            
            <!-- Category -->
            <div class="mb-8">
              <h4 class="font-bold text-gray-800 text-[11px] uppercase tracking-wider mb-4">THỂ LOẠI</h4>
              <div class="space-y-3">
                <label class="flex items-center gap-3 cursor-pointer group">
                  <input type="radio" v-model="selectedCategory" value="" name="category" class="w-4 h-4 text-[#1f3728] focus:ring-[#1f3728]">
                  <span class="text-sm text-gray-600 font-medium group-hover:text-[#1f3728] transition-colors">Tất cả thể loại</span>
                </label>
                <label v-for="cat in categories" :key="cat" class="flex items-center gap-3 cursor-pointer group">
                  <input type="radio" v-model="selectedCategory" :value="cat" name="category" class="w-4 h-4 text-[#1f3728] focus:ring-[#1f3728]">
                  <span class="text-sm text-gray-600 font-medium group-hover:text-[#1f3728] transition-colors capitalize">{{ cat }}</span>
                </label>
              </div>
            </div>

            <!-- Status -->
            <div class="mb-8">
              <h4 class="font-bold text-gray-800 text-[11px] uppercase tracking-wider mb-4">TRẠNG THÁI</h4>
              <div class="space-y-3">
                <label class="flex items-center gap-3 cursor-pointer group">
                  <input type="radio" v-model="selectedStatus" value="all" name="status" class="w-4 h-4 text-[#1f3728] focus:ring-[#1f3728]">
                  <span class="text-sm text-gray-600 font-medium group-hover:text-[#1f3728] transition-colors">Tất cả</span>
                </label>
                <label class="flex items-center gap-3 cursor-pointer group">
                  <input type="radio" v-model="selectedStatus" value="available" name="status" class="w-4 h-4 text-[#1f3728] focus:ring-[#1f3728]">
                  <span class="text-sm text-gray-600 font-medium group-hover:text-[#1f3728] transition-colors">Sẵn có</span>
                </label>
                <label class="flex items-center gap-3 cursor-pointer group">
                  <input type="radio" v-model="selectedStatus" value="borrowed" name="status" class="w-4 h-4 text-[#1f3728] focus:ring-[#1f3728]">
                  <span class="text-sm text-gray-600 font-medium group-hover:text-[#1f3728] transition-colors">Đang mượn</span>
                </label>
              </div>
            </div>

            <button @click="resetFilters" class="w-full bg-[#1b2a20] text-white rounded-xl py-3 text-[11px] font-bold uppercase tracking-wider hover:bg-[#121c15] transition-colors shadow-md">
              Đặt lại bộ lọc
            </button>
          </div>
        </aside>

        <!-- Main Content (Grid) -->
        <main class="flex-1">
          <!-- Sorting & View Options -->
          <div class="flex justify-between items-center mb-6">
            <p class="text-sm text-gray-500 font-medium">Hiển thị <span class="font-bold text-[#1f3728]">{{ filteredBooks.length }}</span> trên tổng số <span class="font-bold text-[#1f3728]">{{ books.length }}</span> sách</p>
            <div class="flex items-center gap-3">
              <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Sắp xếp theo</span>
              <select v-model="sortBy" class="bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#1f3728]">
                <option value="newest">Mới nhất</option>
                <option value="name">Tên A-Z</option>
                <option value="price">Giá mượn</option>
              </select>
            </div>
          </div>

          <!-- Books Grid -->
          <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            <router-link 
              v-for="book in sortedBooks" 
              :key="book._id" 
              :to="'/books/' + book._id" 
              class="group flex flex-col bg-white rounded-2xl p-3 border border-gray-100 shadow-sm hover:shadow-xl hover:border-gray-200 transition-all duration-300">
              <div class="relative rounded-xl overflow-hidden aspect-[3/4] mb-4 bg-gray-100">
                <img v-if="book.cover" :src="book.cover" :alt="`Bìa sách ${book.title}`" @error="useCoverFallback" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div v-else class="w-full h-full flex items-center justify-center text-gray-400">No cover</div>
                <div v-if="book.availableCopies > 0" class="absolute top-2 right-2 bg-[#1f3728] text-white text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded shadow-sm">Sẵn có</div>
                <div v-else class="absolute top-2 right-2 bg-gray-500/90 backdrop-blur-sm text-white text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded shadow-sm">Đang mượn</div>
              </div>
              <h3 class="font-bold text-[#1f3728] text-sm leading-tight mb-1 group-hover:text-[#344d3d] transition-colors line-clamp-2">{{ book.title }}</h3>
              <p class="text-xs text-gray-500 font-medium mb-1">{{ book.author }}</p>
              <p class="text-xs text-orange-600 font-bold mb-3 mt-auto">{{ formatCurrency(book.price) }} đ / lượt</p>
              <div class="flex flex-wrap gap-1">
                <span class="text-[9px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full uppercase tracking-wider">{{ book.category }}</span>
              </div>
            </router-link>
          </div>

          <!-- Empty State -->
          <div v-if="filteredBooks.length === 0" class="text-center py-20 text-gray-500">
            Không tìm thấy sách nào phù hợp.
          </div>

          <!-- Pagination -->
          <div v-if="filteredBooks.length > 0" class="mt-12 flex justify-center items-center gap-2">
            <button class="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-400 hover:text-[#1f3728] hover:border-[#1f3728] transition-colors cursor-not-allowed opacity-50">
              <ChevronLeft class="w-4 h-4" />
            </button>
            <button class="w-10 h-10 flex items-center justify-center rounded-xl border border-[#1f3728] bg-[#1f3728] text-white font-bold text-sm shadow-sm transition-colors">1</button>
            <button class="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-400 hover:text-[#1f3728] hover:border-[#1f3728] transition-colors">
              <ChevronRight class="w-4 h-4" />
            </button>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { 
  Search,
  Filter,
  ChevronLeft,
  ChevronRight
} from 'lucide-vue-next'
import { bookService } from '@/services/book'
import { useCoverFallback } from '@/utils/imageFallback'

const books = ref([])
const categories = ref([])
const searchQuery = ref('')
const selectedCategory = ref('')
const selectedStatus = ref('all')
const sortBy = ref('newest')
const route = useRoute()

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN').format(value || 0)
}

const loadBooks = async () => {
  try {
    const res = await bookService.getBooks()
    books.value = Array.isArray(res) ? res : (res.data || [])
    
    // Extract unique categories
    const cats = new Set(books.value.map(b => b.category))
    categories.value = Array.from(cats).filter(Boolean)
  } catch (error) {
    console.error('Lỗi khi tải sách:', error)
  }
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = ''
  selectedStatus.value = 'all'
  sortBy.value = 'newest'
}

const filteredBooks = computed(() => {
  return books.value.filter(book => {
    // Search filter
    const matchesSearch = 
      book.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.value.toLowerCase())
      
    // Category filter
    const matchesCategory = selectedCategory.value === '' || book.category.toLowerCase() === selectedCategory.value.toLowerCase()
    
    // Status filter
    let matchesStatus = true
    if (selectedStatus.value === 'available') {
      matchesStatus = book.availableCopies > 0
    } else if (selectedStatus.value === 'borrowed') {
      matchesStatus = book.availableCopies === 0
    }
    
    return matchesSearch && matchesCategory && matchesStatus
  })
})

const sortedBooks = computed(() => {
  const result = [...filteredBooks.value]
  if (sortBy.value === 'newest') {
    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  } else if (sortBy.value === 'name') {
    result.sort((a, b) => a.title.localeCompare(b.title))
  } else if (sortBy.value === 'price') {
    result.sort((a, b) => a.price - b.price)
  }
  return result
})

onMounted(() => {
  searchQuery.value = route.query.q || ''
  const categoryQuery = route.query.category || ''
  if (categoryQuery) {
    selectedCategory.value = categoryQuery
  } else if (['vanhoc', 'kynang', 'khoahoc', 'taichinh', 'congnghe', 'thieunhi'].includes(searchQuery.value)) {
    selectedCategory.value = searchQuery.value
    searchQuery.value = ''
  }
  if (['available', 'borrowed'].includes(route.query.status)) {
    selectedStatus.value = route.query.status
  }
  loadBooks()
})
</script>

<style scoped>
.font-title {
  font-family: 'Be Vietnam Pro', sans-serif;
}
</style>
