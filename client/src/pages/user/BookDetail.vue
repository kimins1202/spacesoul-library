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
            <img v-if="book.cover" :src="book.cover" :alt="`Bìa sách ${book.title}`"
              @load="coverLoaded = true" @error="coverFailed = true" v-show="coverLoaded && !coverFailed" />
            <div v-if="!book.cover || coverFailed || !coverLoaded" class="catalog-cover">
              <span>SPACESOUL LIBRARY</span>
              <strong>{{ book.title }}</strong>
              <small>{{ book.author }}</small>
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
            <button class="primary-action" @click="handleBorrowNow" :disabled="book.availableCopies < 1">
              <BookPlus />{{ book.availableCopies > 0 ? 'Gửi yêu cầu mượn' : 'Sách đang được mượn hết' }}
            </button>
            <button @click="handleAddToCart" :disabled="book.availableCopies < 1 || inCart" :class="['secondary-action', { added: inCart }]">
              <ShoppingBag />{{ inCart ? 'Đã thêm vào giỏ mượn' : 'Thêm vào giỏ mượn' }}
            </button>
          </div>
          <p class="action-note"><Info /> Yêu cầu sẽ được thủ thư xác nhận trước khi bạn đến nhận sách.</p>

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
              <span><b>02</b>Chờ thủ thư xác nhận</span>
              <ArrowRight />
              <span><b>03</b>Nhận sách tại quầy</span>
            </div>
          </section>
        </section>
      </main>
    </div>

    <transition name="toast">
      <div v-if="toastMsg" class="toast"><CheckCircle2 />{{ toastMsg }}</div>
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
import { borrowService } from '@/services/borrow'
import { addToCart, isInCart, addNotification } from '@/stores/useAppStore'
import { authService } from '@/services/auth'
import './BookDetail.css'

const route = useRoute()
const router = useRouter()
const book = ref(null)
const isLoading = ref(true)
const errorMessage = ref('')
const toastMsg = ref('')
const coverFailed = ref(false)
const coverLoaded = ref(false)
let toastTimer

const inCart = computed(() => book.value ? isInCart(book.value._id) : false)
const formatCurrency = value => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0)
const categoryLabel = value => ({ vanhoc: 'Văn học', kynang: 'Kỹ năng', khoahoc: 'Khoa học', taichinh: 'Tài chính', congnghe: 'Công nghệ', thieunhi: 'Thiếu nhi' }[value] || value || 'Sách')
const showToast = message => {
  toastMsg.value = message
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toastMsg.value = '' }, 3000)
}

const fetchBook = async () => {
  isLoading.value = true
  errorMessage.value = ''
  coverFailed.value = false
  coverLoaded.value = false
  try {
    book.value = await bookService.getBookById(route.params.id)
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
  if (authService.getCurrentUser()?.type === 'Employee') {
    showToast('Tài khoản nhân viên không thể gửi yêu cầu mượn.')
    return false
  }
  return true
}

const handleAddToCart = () => {
  if (!ensureReader()) return
  if (addToCart(book.value)) showToast(`Đã thêm “${book.value.title}” vào giỏ mượn.`)
}

const handleBorrowNow = async () => {
  if (!ensureReader()) return
  try {
    await borrowService.createBorrowRequest(book.value._id)
    addNotification({ title: 'Đã gửi yêu cầu mượn', message: `Yêu cầu mượn “${book.value.title}” đang chờ thủ thư duyệt.`, type: 'success' })
    router.push('/borrowed')
  } catch (error) {
    showToast(error.message || 'Không thể gửi yêu cầu mượn.')
  }
}

watch(() => route.params.id, fetchBook, { immediate: true })
</script>

<style scoped>
.detail-page{min-height:70vh;background:#f6f7f3;color:#1d392a}.detail-shell{max-width:1180px;margin:auto;padding:30px 24px 90px}.breadcrumb{display:flex;align-items:center;gap:7px;margin-bottom:28px;color:#7a867e;font-size:.72rem}.breadcrumb svg{width:13px}.breadcrumb span{max-width:280px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#2d4938;font-weight:700}.detail-grid{display:grid;grid-template-columns:330px minmax(0,1fr);gap:54px}.cover-column{position:sticky;top:102px;height:max-content}.cover-stage{min-height:450px;padding:28px;display:grid;place-items:center;border:1px solid #dedfd7;border-radius:22px;background:linear-gradient(145deg,#ecede7,#dfe4dc);box-shadow:0 18px 42px rgba(24,53,37,.11)}.cover-stage img{width:100%;max-height:410px;object-fit:contain;border-radius:5px;box-shadow:0 18px 32px rgba(0,0,0,.2)}.catalog-cover{width:235px;aspect-ratio:2/3;padding:24px;display:flex;flex-direction:column;justify-content:space-between;text-align:center;border-radius:5px;background:linear-gradient(150deg,#183d2c,#2c6548);color:white;box-shadow:0 18px 32px rgba(0,0,0,.2)}.catalog-cover span{font-size:.55rem;letter-spacing:.16em;color:#e2c47d}.catalog-cover strong{font-family:Georgia,serif;font-size:1.65rem;line-height:1.15}.catalog-cover small{color:rgba(255,255,255,.65)}.shelf-note{margin-top:12px;padding:13px 16px;display:flex;align-items:center;gap:10px;border:1px solid #dee1da;border-radius:13px;background:#fff}.shelf-note svg{width:18px;color:#9a7331}.shelf-note span{display:flex;flex-direction:column;color:#849087;font-size:.64rem}.shelf-note strong{color:#294936;font-size:.8rem}.title-badges{display:flex;gap:8px;align-items:center}.category,.availability{padding:6px 10px;border-radius:99px;font-size:.62rem;font-weight:800;text-transform:uppercase;letter-spacing:.06em}.category{background:#e8eee9;color:#28553c}.availability{display:flex;align-items:center;gap:5px;background:#e4f2e7;color:#2c7042}.availability svg{width:13px}.availability.empty{background:#f3e7e4;color:#a2473e}.title-block h1{max-width:760px;margin:16px 0 7px;font-size:clamp(2.25rem,5vw,4.3rem);line-height:1.02;letter-spacing:-.055em}.author{color:#7a847d;font-size:.9rem}.author strong{color:#294736}.rating{margin-top:12px;display:flex;align-items:center;gap:3px;color:#c89536}.rating svg{width:16px;fill:currentColor}.rating svg.muted{color:#d9ddd7}.rating strong{margin-left:5px;font-size:.75rem}.circulation-card{margin-top:30px;padding:20px 22px;display:grid;grid-template-columns:repeat(3,1fr);border:1px solid #dde0d8;border-radius:16px;background:white;box-shadow:0 9px 28px rgba(31,55,40,.05)}.circulation-card>div{padding:0 18px;border-right:1px solid #e5e7e1}.circulation-card>div:first-child{padding-left:0}.circulation-card>div:last-child{border:0}.circulation-card span{display:block;color:#849087;font-size:.63rem}.circulation-card strong{display:block;margin-top:5px;color:#234532;font-size:1.05rem}.circulation-card small{color:#8b948e;font-size:.65rem}.actions{margin-top:18px;display:grid;grid-template-columns:1fr 1fr;gap:10px}.actions button{min-height:48px;display:flex;align-items:center;justify-content:center;gap:8px;border-radius:11px;font-size:.76rem;font-weight:800;cursor:pointer}.actions svg{width:18px}.primary-action{border:0;background:#214b35;color:white}.secondary-action{border:1px solid #28533c;background:white;color:#28533c}.secondary-action.added{background:#e8efe9}.actions button:disabled{opacity:.48;cursor:not-allowed}.action-note{margin-top:10px;display:flex;align-items:center;gap:6px;color:#7d8780;font-size:.66rem}.action-note svg{width:14px}.metadata{margin-top:28px;display:grid;grid-template-columns:repeat(4,1fr);gap:10px}.metadata>div{min-height:75px;padding:14px;display:flex;align-items:center;gap:10px;border:1px solid #e0e2dc;border-radius:13px;background:#fff}.metadata>div.isbn{grid-column:span 2}.metadata svg{width:18px;color:#997333}.metadata span{display:flex;flex-direction:column;color:#8a938d;font-size:.6rem}.metadata strong{margin-top:3px;color:#334a3d;font-size:.72rem}.description{margin-top:28px;padding:28px;border:1px solid #e0e2dc;border-radius:18px;background:white}.description>div{display:flex;align-items:center;gap:9px}.description svg{width:20px;color:#9a7432}.description h2,.loan-guide h2{font-size:1.05rem}.description p{margin-top:14px;color:#657169;font-size:.84rem;line-height:1.9}.loan-guide{margin-top:16px;padding:24px 28px;border-radius:18px;background:#1c422f;color:white}.loan-guide h2{margin-bottom:17px}.loan-guide>div{display:flex;align-items:center;justify-content:space-between;gap:12px}.loan-guide span{display:flex;align-items:center;gap:8px;color:rgba(255,255,255,.72);font-size:.67rem}.loan-guide b{width:28px;height:28px;display:grid;place-items:center;border-radius:50%;background:#dfbd73;color:#183b2a;font-size:.6rem}.loan-guide svg{width:15px;color:rgba(255,255,255,.3)}.state-view{min-height:500px;display:flex;align-items:center;justify-content:center;flex-direction:column;text-align:center;color:#879189}.state-view>svg{width:38px}.state-view h2{margin:13px 0 5px;color:#274533}.state-view button{margin-top:17px;padding:10px 14px;display:flex;align-items:center;gap:7px;border:0;border-radius:9px;background:#28533b;color:white;font-weight:700}.state-view button svg{width:16px}.toast{position:fixed;z-index:100;right:24px;bottom:24px;max-width:360px;padding:13px 17px;display:flex;align-items:center;gap:8px;border-radius:12px;background:#214c36;color:white;box-shadow:0 16px 40px rgba(20,50,34,.22);font-size:.75rem;font-weight:700}.toast svg{width:18px}.toast-enter-active,.toast-leave-active{transition:.25s}.toast-enter-from,.toast-leave-to{opacity:0;transform:translateY(10px)}
@media(max-width:900px){.detail-grid{grid-template-columns:260px minmax(0,1fr);gap:30px}.cover-column{position:static}.cover-stage{min-height:370px}.circulation-card{grid-template-columns:1fr}.circulation-card>div{padding:12px 0;border-right:0;border-bottom:1px solid #e5e7e1}.metadata{grid-template-columns:repeat(2,1fr)}}
@media(max-width:680px){.detail-shell{padding:24px 16px 70px}.detail-grid{grid-template-columns:1fr}.cover-column{max-width:310px;width:100%;margin:auto}.title-block h1{font-size:2.5rem}.actions{grid-template-columns:1fr}.metadata{grid-template-columns:1fr}.metadata>div.isbn{grid-column:auto}.loan-guide>div{align-items:flex-start;flex-direction:column}.loan-guide>div>svg{transform:rotate(90deg);margin-left:7px}}
</style>
