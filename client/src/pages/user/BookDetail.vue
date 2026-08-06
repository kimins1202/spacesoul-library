<template>
  <div class="detail-page">
    <div class="detail-shell">
      <nav class="breadcrumb" aria-label="Điều hướng">
        <router-link to="/">Trang chủ</router-link><ChevronRight />
        <router-link to="/books">Danh mục sách</router-link><ChevronRight />
        <span>{{ book?.title || 'Chi tiết sách' }}</span>
      </nav>

      <div v-if="isLoading" class="state-view"><Loader2 class="animate-spin" /><p>Đang tải thông tin sách...</p></div>
      <div v-else-if="errorMessage" class="state-view">
        <BookOpen /><h2>Không thể mở thông tin sách</h2><p>{{ errorMessage }}</p>
        <button @click="router.push('/books')"><ArrowLeft /> Quay lại danh mục</button>
      </div>

      <main v-else-if="book" class="detail-grid">
        <aside class="cover-column">
          <div class="cover-stage">
            <div class="catalog-cover">
              <BookCover :src="book.cover" :title="book.title" :author="book.author" />
            </div>
          </div>
          <div class="shelf-note"><MapPin /><span>Vị trí sách<strong>{{ book.shelfLocation || 'Đang cập nhật' }}</strong></span></div>
        </aside>

        <section class="book-content">
          <div class="title-block">
            <div class="title-badges">
              <span class="category">{{ categoryLabel(book.category) }}</span>
              <span :class="['availability', { empty: book.availableCopies < 1 }]">
                <CircleCheck v-if="book.availableCopies > 0" /><CircleX v-else />
                {{ book.availableCopies > 0 ? 'Có thể mượn' : 'Tạm hết sách' }}
              </span>
            </div>
            <h1>{{ book.title }}</h1>
            <p class="author">Tác giả <strong>{{ book.author }}</strong></p>
            <div v-if="book.rating" class="rating"><Star v-for="n in 5" :key="n" :class="{ muted: n > Math.round(book.rating) }" /><strong>{{ book.rating.toFixed(1) }}</strong></div>
          </div>

          <div class="circulation-card">
            <div class="price">
              <span>Phí mượn / lượt</span>
              <strong>{{ formatCurrency(book.price) }}</strong>
            </div>
            <div class="copies">
              <span>Số bản còn tại thư viện</span>
              <strong>{{ book.availableCopies }} <small>/ {{ book.totalCopies }} cuốn</small></strong>
            </div>
            <div class="loan-period">
              <span>Thời hạn tiêu chuẩn</span>
              <strong>14 ngày</strong>
            </div>
          </div>

          <div class="actions">
            <div class="quantity-picker">
              <span>Số lượng muốn mượn</span>
              <div>
                <button type="button" @click="decreaseQuantity" :disabled="borrowQuantity <= 1" aria-label="Giảm số lượng">−</button>
                <input v-model.number="borrowQuantity" type="number" min="1" :max="maxBorrowQuantity" @change="normalizeQuantity" aria-label="Số lượng sách muốn mượn" />
                <button type="button" @click="increaseQuantity" :disabled="borrowQuantity >= maxBorrowQuantity" aria-label="Tăng số lượng">+</button>
              </div>
              <small>Tối đa {{ maxBorrowQuantity }} quyển cho đầu sách này</small>
            </div>
            <button class="primary-action" @click="handleBorrowNow" :disabled="book.availableCopies < 1 || isBorrowing">
              <Loader2 v-if="isBorrowing" class="animate-spin" />
              <BookPlus v-else />{{ book.availableCopies > 0 ? `Mượn ${borrowQuantity} quyển` : 'Sách đang được mượn hết' }}
            </button>
            <button @click="handleAddToCart" :disabled="book.availableCopies < 1 || inCart" :class="['secondary-action', { added: inCart }]">
              <ShoppingBag />{{ inCart ? 'Đã thêm vào giỏ mượn' : 'Thêm vào giỏ mượn' }}
            </button>
          </div>
          <p class="action-note"><Info /> Yêu cầu sẽ được quản trị viên duyệt trước khi bạn đến nhận sách.</p>

          <div class="metadata">
            <div><Building2 /><span>Nhà xuất bản<strong>{{ book.publisher?.name || 'Đang cập nhật' }}</strong></span></div>
            <div><Calendar /><span>Năm xuất bản<strong>{{ book.publishYear || '—' }}</strong></span></div>
            <div><Languages /><span>Ngôn ngữ<strong>{{ book.language || 'Tiếng Việt' }}</strong></span></div>
            <div><Files /><span>Số trang<strong>{{ book.pages ? `${book.pages} trang` : 'Đang cập nhật' }}</strong></span></div>
            <div class="isbn"><Barcode /><span>ISBN<strong>{{ book.isbn || 'Chưa có dữ liệu' }}</strong></span></div>
          </div>

          <article class="description">
            <div><AlignLeft /><h2>Giới thiệu nội dung</h2></div>
            <p>{{ book.description || 'Nội dung giới thiệu cho đầu sách này đang được thư viện cập nhật.' }}</p>
          </article>

          <section class="loan-guide">
            <h2>Quy trình mượn sách</h2>
            <div>
              <span><b>01</b>Gửi yêu cầu trực tuyến</span>
              <ArrowRight />
              <span><b>02</b>Chờ quản trị viên duyệt</span>
              <ArrowRight />
              <span><b>03</b>Nhận sách tại quầy</span>
            </div>
          </section>
        </section>
      </main>
    </div>

    <transition name="toast">
      <div v-if="toastMsg" :class="['toast', `toast-${toastType}`]">
        <CheckCircle2 v-if="toastType === 'success'" />
        <CircleX v-else />
        {{ toastMsg }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  AlignLeft, ArrowLeft, ArrowRight, Barcode, BookOpen, BookPlus, Building2,
  Calendar, CheckCircle2, ChevronRight, CircleCheck, CircleX, Files, Info,
  Languages, Loader2, MapPin, ShoppingBag, Star
} from 'lucide-vue-next'
import { bookService } from '@/services/book'
import BookCover from '@/components/books/BookCover.vue'
import { categoryLabel } from '@/utils/categories'
import { borrowService } from '@/services/borrow'
import { addToCart, isInCart } from '@/stores/useAppStore'
import { authService } from '@/services/auth'
import './BookDetail.css'

const route = useRoute()
const router = useRouter()
const book = ref(null)
const isLoading = ref(true)
const errorMessage = ref('')
const toastMsg = ref('')
const toastType = ref('success')
const borrowQuantity = ref(1)
const isBorrowing = ref(false)
let toastTimer

const inCart = computed(() => book.value ? isInCart(book.value._id) : false)
const maxBorrowQuantity = computed(() => Math.max(1, Math.min(10, Number(book.value?.availableCopies) || 1)))
const formatCurrency = value => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0)
const showToast = (message, type = 'success') => {
  toastMsg.value = message
  toastType.value = type
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toastMsg.value = '' }, 3000)
}

const fetchBook = async () => {
  isLoading.value = true
  errorMessage.value = ''
  try {
    book.value = await bookService.getBookById(route.params.id)
    borrowQuantity.value = 1
  } catch (error) {
    book.value = null
    errorMessage.value = error.message || 'Sách không tồn tại hoặc đã được xóa.'
  } finally {
    isLoading.value = false
  }
}

const ensureReader = () => {
  if (!authService.isAuthenticated()) {
    router.push({ path: '/login', query: { redirect: route.fullPath } })
    return false
  }
  if (authService.getCurrentUser()?.role === 'admin') {
    showToast('Tài khoản quản trị không thể gửi yêu cầu mượn.', 'error')
    return false
  }
  return true
}

const handleAddToCart = () => {
  if (!ensureReader()) return
  if (addToCart(book.value, borrowQuantity.value)) {
    showToast(`Đã thêm ${borrowQuantity.value} quyển “${book.value.title}” vào giỏ mượn.`)
  }
}

const handleBorrowNow = async () => {
  if (!ensureReader()) return
  normalizeQuantity()
  isBorrowing.value = true
  try {
    await borrowService.createBorrowRequest(book.value._id, borrowQuantity.value)
    router.push({ path: '/borrowed', query: { notice: 'borrow-success' } })
  } catch (error) {
    showToast(error.message || 'Không thể gửi yêu cầu mượn.', 'error')
  } finally {
    isBorrowing.value = false
  }
}

const normalizeQuantity = () => {
  const value = Math.trunc(Number(borrowQuantity.value) || 1)
  borrowQuantity.value = Math.min(maxBorrowQuantity.value, Math.max(1, value))
}
const decreaseQuantity = () => { borrowQuantity.value = Math.max(1, borrowQuantity.value - 1) }
const increaseQuantity = () => { borrowQuantity.value = Math.min(maxBorrowQuantity.value, borrowQuantity.value + 1) }

watch(() => route.params.id, fetchBook, { immediate: true })
</script>
