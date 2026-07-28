<template>
  <div class="max-w-7xl mx-auto px-6 py-8">
    <!-- Breadcrumb -->
    <nav class="flex text-sm font-semibold text-gray-500 mb-8 items-center gap-2">
      <router-link to="/" class="hover:text-[#1f3728]">Trang chủ</router-link>
      <ChevronRight class="w-4 h-4" />
      <router-link to="/books" class="hover:text-[#1f3728]">Danh mục</router-link>
      <ChevronRight class="w-4 h-4" />
      <span class="text-[#1f3728]" v-if="book">{{ book.title }}</span>
    </nav>

    <div v-if="isLoading" class="py-20 text-center text-gray-500">Đang tải dữ liệu...</div>

    <div v-else-if="book" class="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
      <!-- Left Column -->
      <div class="lg:col-span-4 flex flex-col gap-4">
        <!-- Book Cover -->
        <div class="bg-[#102a1d] rounded-2xl p-6 flex justify-center items-center aspect-[4/5] shadow-xl overflow-hidden relative">
          <div class="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent"></div>
          <img v-if="book.cover" :src="book.cover" alt="Cover" class="w-3/4 h-auto object-cover shadow-2xl rounded-sm z-10" />
          <div v-else class="text-white z-10 flex flex-col items-center gap-3">
            <BookOpen class="w-16 h-16 text-white/30" />
            <span class="text-white/50 text-sm">Không có ảnh bìa</span>
          </div>
        </div>

        <!-- Price badge -->
        <div class="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center justify-between">
          <span class="text-xs font-bold text-amber-700 uppercase tracking-wider">Phí mượn / lần</span>
          <span class="text-lg font-bold text-amber-700">{{ formatCurrency(book.price) }}đ</span>
        </div>

        <!-- Action Buttons -->
        <div class="space-y-3">
          <!-- Borrow Now -->
          <button
            @click="handleBorrowNow"
            :disabled="book.availableCopies === 0"
            class="w-full bg-[#1f3728] text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#16241c] transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm">
            <BookPlus class="w-5 h-5" />
            {{ book.availableCopies > 0 ? 'Đăng ký mượn ngay' : 'Đã mượn hết' }}
          </button>

          <!-- Add to Cart -->
          <button
            @click="handleAddToCart"
            :disabled="book.availableCopies === 0 || inCart"
            :class="['w-full font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all text-sm border-2',
              inCart
                ? 'bg-green-50 border-green-300 text-green-700 cursor-default'
                : book.availableCopies === 0
                  ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                  : 'border-[#1f3728] text-[#1f3728] hover:bg-[#1f3728] hover:text-white']">
            <ShoppingBag class="w-4 h-4" />
            {{ inCart ? '✓ Đã có trong giỏ' : 'Thêm vào giỏ mượn' }}
          </button>
        </div>

        <!-- Cart hint -->
        <p v-if="!inCart && book.availableCopies > 0" class="text-center text-xs text-gray-400">
          Thêm vào giỏ để mượn nhiều sách cùng lúc
        </p>
      </div>

      <!-- Right Column -->
      <div class="lg:col-span-8">
        <div class="inline-block bg-[#1f3728]/10 text-[#1f3728] text-xs font-bold px-3 py-1.5 rounded-full mb-4 capitalize">
          {{ book.category }}
        </div>
        <h1 class="text-4xl md:text-5xl font-bold text-[#1f3728] mb-2 font-title leading-tight">{{ book.title }}</h1>
        <p class="text-lg font-medium text-gray-600 mb-8">
          Tác giả: <span class="text-[#1f3728] font-bold">{{ book.author }}</span>
        </p>

        <!-- Stats Grid -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div class="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
            <BookOpen class="w-6 h-6 text-gray-400 mb-2" />
            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Tình trạng</span>
            <span class="text-lg font-bold" :class="book.availableCopies > 0 ? 'text-[#1f3728]' : 'text-red-600'">
              {{ book.availableCopies }}/{{ book.totalCopies }}
            </span>
          </div>
          <div class="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
            <Building2 class="w-6 h-6 text-gray-400 mb-2" />
            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Nhà xuất bản</span>
            <span class="text-sm font-bold text-[#1f3728] text-center">{{ book.publisher?.name || 'N/A' }}</span>
          </div>
          <div class="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
            <Calendar class="w-6 h-6 text-gray-400 mb-2" />
            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Năm phát hành</span>
            <span class="text-lg font-bold text-[#1f3728]">{{ book.publishYear }}</span>
          </div>
          <div class="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
            <Globe class="w-6 h-6 text-gray-400 mb-2" />
            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Ngôn ngữ</span>
            <span class="text-lg font-bold text-[#1f3728]">Tiếng Việt</span>
          </div>
        </div>

        <!-- Summary -->
        <div class="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm mb-8">
          <div class="flex items-center gap-3 mb-6">
            <AlignLeft class="w-6 h-6 text-[#1f3728]" />
            <h3 class="text-xl font-bold text-[#1f3728]">Tóm tắt nội dung</h3>
          </div>
          <div class="text-gray-600 leading-relaxed space-y-4">
            <p>{{ book.description || 'Chưa có thông tin mô tả cho sách này.' }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Toast Notification -->
  <transition name="toast">
    <div v-if="toastMsg"
      class="fixed bottom-6 right-6 z-[200] bg-[#1f3728] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-semibold max-w-xs">
      <CheckCircle2 class="w-5 h-5 text-green-400 flex-shrink-0" />
      {{ toastMsg }}
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ChevronRight, BookPlus, BookOpen, Building2, Calendar, Globe, AlignLeft, ShoppingBag, CheckCircle2
} from 'lucide-vue-next'
import { bookService } from '@/services/book'
import { borrowService } from '@/services/borrow'
import { addToCart, isInCart, addNotification } from '@/stores/useAppStore'
import { authService } from '@/services/auth'

const route = useRoute()
const router = useRouter()
const book = ref(null)
const isLoading = ref(true)
const toastMsg = ref('')
let toastTimer = null

const inCart = computed(() => book.value ? isInCart(book.value._id) : false)

const formatCurrency = (value) => new Intl.NumberFormat('vi-VN').format(value || 0)

const showToast = (msg) => {
  toastMsg.value = msg
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toastMsg.value = '' }, 3000)
}

const fetchBook = async () => {
  try {
    const res = await bookService.getBookById(route.params.id)
    book.value = res
  } catch (error) {
    console.error('Lỗi khi lấy sách:', error)
  } finally {
    isLoading.value = false
  }
}

const handleAddToCart = () => {
  if (!authService.isAuthenticated()) {
    router.push('/login')
    return
  }
  const added = addToCart(book.value)
  if (added) {
    showToast(`Đã thêm "${book.value.title}" vào giỏ mượn!`)
  }
}

const handleBorrowNow = async () => {
  if (!authService.isAuthenticated()) {
    router.push('/login')
    return
  }
  try {
    await borrowService.createBorrowRequest(book.value._id)
    addNotification({
      title: 'Đăng ký mượn thành công!',
      message: `Yêu cầu mượn sách "${book.value.title}" đã được gửi. Vui lòng chờ thủ thư duyệt.`,
      type: 'success'
    })
    router.push('/borrowed')
  } catch (error) {
    addNotification({
      title: 'Không thể mượn sách',
      message: error.message || 'Có lỗi xảy ra khi đăng ký mượn sách.',
      type: 'error'
    })
    showToast(error.message || 'Có lỗi xảy ra khi mượn sách')
  }
}

onMounted(fetchBook)
</script>

<style scoped>
.font-title { font-family: 'Inter', sans-serif; }

.toast-enter-active, .toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.9);
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.9);
}
</style>
