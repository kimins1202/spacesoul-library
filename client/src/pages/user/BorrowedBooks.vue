<template>
  <div class="borrow-page">
    <section class="borrow-hero">
      <div>
        <span class="eyebrow"><ClipboardList class="w-4 h-4" /> Tài khoản độc giả</span>
        <h1>Yêu cầu mượn của tôi</h1>
        <p>Theo dõi toàn bộ quá trình từ lúc gửi yêu cầu, nhận sách đến khi hoàn trả.</p>
      </div>
      <router-link to="/books" class="browse-button"><Plus class="w-4 h-4" /> Mượn thêm sách</router-link>
    </section>

    <section class="summary-grid">
      <article v-for="item in summaries" :key="item.label" class="summary-card">
        <span :class="['summary-icon', item.tone]"><component :is="item.icon" /></span>
        <div><strong>{{ item.value }}</strong><span>{{ item.label }}</span></div>
      </article>
    </section>

    <section class="borrow-panel">
      <div class="panel-toolbar">
        <div class="tabs" role="tablist" aria-label="Lọc yêu cầu mượn">
          <button v-for="tab in tabs" :key="tab.value" @click="activeFilter = tab.value"
            :class="{ active: activeFilter === tab.value }" role="tab">
            {{ tab.label }}
            <span v-if="countByStatus(tab.value)">{{ countByStatus(tab.value) }}</span>
          </button>
        </div>
        <button class="refresh-button" :disabled="isLoading" @click="loadMyBorrows">
          <RefreshCw :class="['w-4 h-4', { 'animate-spin': isLoading }]" /> Làm mới
        </button>
      </div>

      <div v-if="errorMessage" class="error-state">
        <AlertCircle class="w-5 h-5" />
        <div><strong>Không thể tải yêu cầu mượn</strong><p>{{ errorMessage }}</p></div>
        <button @click="loadMyBorrows">Thử lại</button>
      </div>

      <div v-else-if="isLoading" class="loading-state">
        <Loader2 class="w-6 h-6 animate-spin" /><span>Đang tải yêu cầu mượn...</span>
      </div>

      <div v-else-if="filteredBorrows.length === 0" class="empty-state">
        <span><BookOpen /></span>
        <h2>{{ activeFilter === 'all' ? 'Bạn chưa có yêu cầu mượn nào' : 'Không có yêu cầu ở trạng thái này' }}</h2>
        <p>Khám phá danh mục và chọn những cuốn sách phù hợp với bạn.</p>
        <router-link to="/books">Khám phá sách</router-link>
      </div>

      <div v-else class="borrow-list">
        <article v-for="borrow in filteredBorrows" :key="borrow._id" class="borrow-card">
          <router-link v-if="borrow.book?._id" :to="`/books/${borrow.book._id}`" class="cover">
            <BookCover :src="borrow.book.cover" :title="borrow.book.title" :author="borrow.book.author" />
          </router-link>
          <div v-else class="cover"><BookOpen /></div>

          <div class="borrow-info">
            <div class="book-title-row">
              <div>
                <span class="category">{{ categoryLabel(borrow.book?.category) }}</span>
                <h2>{{ borrow.book?.title || 'Sách không còn trong hệ thống' }}</h2>
                <p>{{ borrow.book?.author || 'Không xác định' }}</p>
              </div>
              <span :class="['status', `status-${borrow.status}`]">
                <component :is="statusIcon(borrow.status)" /> {{ statusLabel(borrow.status) }}
              </span>
            </div>

            <div class="timeline">
              <div><span>Ngày yêu cầu</span><strong>{{ formatDate(borrow.createdAt) }}</strong></div>
              <div><span>Ngày nhận sách</span><strong>{{ formatDate(borrow.borrowDate) }}</strong></div>
              <div><span>Hạn trả</span><strong :class="{ overdue: isOverdue(borrow) }">{{ formatDate(borrow.dueDate) }}</strong></div>
              <div><span>Phí mượn / lượt</span><strong>{{ formatCurrency(borrow.book?.price) }}</strong></div>
            </div>

            <div class="card-footer">
              <p>{{ statusDescription(borrow) }}</p>
              <div class="actions">
                <button v-if="['borrowing', 'overdue'].includes(borrow.status)" class="return" @click="handleReturn(borrow._id)">
                  <Undo2 class="w-4 h-4" /> Gửi yêu cầu trả
                </button>
                <router-link v-if="borrow.book?._id" :to="`/books/${borrow.book._id}`">Xem chi tiết</router-link>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>

    <transition name="toast">
      <div v-if="toastMessage" class="toast"><CheckCircle2 class="w-5 h-5" />{{ toastMessage }}</div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  AlertCircle, BookOpen, CheckCircle2, CircleDashed, ClipboardList, Clock3,
  History, Loader2, PackageCheck, Plus, RefreshCw, Undo2
} from 'lucide-vue-next'
import { borrowService } from '@/services/borrow'
import { categoryLabel } from '@/utils/categories'
import BookCover from '@/components/books/BookCover.vue'

const myBorrows = ref([])
const isLoading = ref(false)
const errorMessage = ref('')
const toastMessage = ref('')
const activeFilter = ref('all')
let toastTimer

const tabs = [
  { value: 'all', label: 'Tất cả' },
  { value: 'pending', label: 'Chờ duyệt' },
  { value: 'borrowing', label: 'Đang mượn' },
  { value: 'overdue', label: 'Quá hạn' },
  { value: 'pending-return', label: 'Chờ nhận lại' },
  { value: 'returned', label: 'Đã trả' }
]

const activeBorrows = computed(() => myBorrows.value.filter(item => ['borrowing', 'pending-return', 'overdue'].includes(item.status)).length)
const summaries = computed(() => [
  { label: 'Tổng yêu cầu', value: myBorrows.value.length, icon: History, tone: 'green' },
  { label: 'Chờ duyệt', value: countByStatus('pending'), icon: CircleDashed, tone: 'gold' },
  { label: 'Đang giữ sách', value: activeBorrows.value, icon: BookOpen, tone: 'blue' },
  { label: 'Đã hoàn trả', value: countByStatus('returned'), icon: PackageCheck, tone: 'gray' }
])

const filteredBorrows = computed(() => activeFilter.value === 'all'
  ? myBorrows.value
  : myBorrows.value.filter(item => item.status === activeFilter.value))

const countByStatus = status => status === 'all'
  ? myBorrows.value.length
  : myBorrows.value.filter(item => item.status === status).length

const formatDate = value => value ? new Date(value).toLocaleDateString('vi-VN') : '—'
const formatCurrency = value => value
  ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
  : 'Miễn phí'
const isOverdue = borrow => borrow.status === 'overdue' || (
  borrow.dueDate && ['borrowing'].includes(borrow.status) && new Date(borrow.dueDate) < new Date()
)
const statusLabel = status => ({
  pending: 'Chờ duyệt', borrowing: 'Đang mượn', 'pending-return': 'Chờ xác nhận trả',
  returned: 'Đã trả', overdue: 'Quá hạn'
}[status] || status)
const statusIcon = status => ({
  pending: Clock3, borrowing: BookOpen, 'pending-return': Undo2,
  returned: CheckCircle2, overdue: AlertCircle
}[status] || CircleDashed)
const statusDescription = borrow => ({
  pending: 'Quản trị viên đang kiểm tra tình trạng sách và sẽ phản hồi yêu cầu của bạn.',
  borrowing: `Bạn đang giữ sách. Vui lòng hoàn trả trước ngày ${formatDate(borrow.dueDate)}.`,
  'pending-return': `Yêu cầu trả đã được gửi ngày ${formatDate(borrow.returnRequestedAt)}. Vui lòng mang sách đến thư viện để xác nhận.`,
  returned: `Sách đã được hoàn trả ngày ${formatDate(borrow.returnDate)}.`,
  overdue: 'Sách đã quá hạn. Vui lòng trả sách và liên hệ thư viện sớm nhất.'
}[borrow.status] || '')

const showToast = message => {
  toastMessage.value = message
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toastMessage.value = '' }, 3000)
}

const loadMyBorrows = async () => {
  isLoading.value = true
  errorMessage.value = ''
  try {
    const response = await borrowService.getMyBorrows()
    myBorrows.value = Array.isArray(response)
      ? response.filter(item => item.status !== 'cancelled')
      : []
  } catch (error) {
    errorMessage.value = error.message || 'Không thể kết nối đến máy chủ.'
  } finally {
    isLoading.value = false
  }
}

const handleReturn = async id => {
  try {
    const response = await borrowService.requestBookReturn(id)
    const updated = response.borrow
    const index = myBorrows.value.findIndex(item => item._id === id)
    if (index !== -1) myBorrows.value[index] = { ...myBorrows.value[index], ...updated }
    showToast('Đã gửi yêu cầu trả sách.')
  } catch (error) {
    alert(error.message)
  }
}

onMounted(loadMyBorrows)
</script>

<style scoped>
.borrow-page { max-width: 1180px; margin: auto; padding: 54px 24px 90px; color: #1f3728; }
.borrow-hero { padding: 32px 36px; display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; border-radius: 22px; color: white; background: radial-gradient(circle at 90% 0%, rgba(224,189,112,.24), transparent 18rem), linear-gradient(135deg, #173b2b, #28533d); }
.eyebrow { display: inline-flex; gap: 7px; align-items: center; color: #e3c47d; font-size: .68rem; font-weight: 800; letter-spacing: .13em; text-transform: uppercase; }
.borrow-hero h1 { margin: 9px 0 5px; font-size: clamp(1.8rem, 4vw, 2.7rem); letter-spacing: -.04em; }
.borrow-hero p { color: rgba(255,255,255,.65); font-size: .84rem; }
.browse-button { flex: 0 0 auto; padding: 11px 15px; display: inline-flex; align-items: center; gap: 7px; border-radius: 10px; background: #e1bd70; color: #17372d; font-size: .76rem; font-weight: 800; }
.summary-grid { margin: 22px 0; display: grid; grid-template-columns: repeat(4, 1fr); gap: 13px; }
.summary-card { padding: 18px; display: flex; align-items: center; gap: 13px; border: 1px solid #e4e2da; border-radius: 15px; background: white; box-shadow: 0 8px 24px rgba(31,55,40,.04); }
.summary-card > div { display: flex; flex-direction: column; }
.summary-card strong { font-size: 1.35rem; }
.summary-card div span { color: #7d887f; font-size: .7rem; }
.summary-icon { width: 40px; height: 40px; display: grid; place-items: center; border-radius: 12px; }
.summary-icon :deep(svg) { width: 19px; }.green{background:#e5eee7;color:#2d6944}.gold{background:#f5ecd8;color:#a1742c}.blue{background:#e2ecf1;color:#3c6475}.gray{background:#eeefec;color:#6c766f}
.borrow-panel { overflow: hidden; border: 1px solid #e2e0d8; border-radius: 20px; background: #fff; box-shadow: 0 12px 35px rgba(31,55,40,.055); }
.panel-toolbar { min-height: 68px; padding: 12px 18px; display: flex; align-items: center; justify-content: space-between; gap: 14px; border-bottom: 1px solid #ebe8e0; background: #fcfcf9; }
.tabs { display: flex; gap: 5px; overflow-x: auto; }
.tabs button { padding: 9px 12px; display: inline-flex; align-items: center; gap: 6px; white-space: nowrap; border: 0; border-radius: 9px; background: transparent; color: #78827a; font-size: .7rem; font-weight: 750; cursor: pointer; }
.tabs button span { min-width: 18px; height: 18px; padding: 0 5px; display: grid; place-items: center; border-radius: 99px; background: #eceeea; font-size: .58rem; }
.tabs button.active { background: #e8eee9; color: #204b35; }
.tabs button.active span { background: #2c5c42; color: white; }
.refresh-button { flex: 0 0 auto; padding: 8px 10px; display: flex; align-items: center; gap: 6px; border: 1px solid #deddd6; border-radius: 9px; background: white; color: #56635a; font-size: .68rem; font-weight: 700; cursor: pointer; }
.borrow-list { padding: 16px; display: grid; gap: 12px; background: #f8f8f4; }
.borrow-card { padding: 16px; display: flex; gap: 18px; border: 1px solid #e5e3dc; border-radius: 16px; background: white; transition: .2s ease; }
.borrow-card:hover { border-color: #cbd5cc; box-shadow: 0 10px 28px rgba(31,55,40,.07); }
.cover { width: 82px; height: 116px; flex: 0 0 auto; display: grid; place-items: center; overflow: hidden; border: 1px solid #dfe3dc; border-radius: 8px; background: #ecece7; color: #a8afa9; box-shadow: 0 6px 16px rgba(28,52,38,.1); }
.cover img { width: 100%; height: 100%; object-fit: cover; }
.cover > svg { width: 28px; }
.borrow-info { min-width: 0; flex: 1; }
.book-title-row { display: flex; justify-content: space-between; gap: 18px; }
.category { color: #aa7c2f; font-size: .59rem; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; }
.book-title-row h2 { margin: 4px 0 2px; font-size: 1.05rem; }
.book-title-row p { color: #7b857e; font-size: .73rem; }
.status { height: max-content; flex: 0 0 auto; padding: 6px 9px; display: flex; align-items: center; gap: 5px; border-radius: 99px; font-size: .61rem; font-weight: 800; }
.status :deep(svg) { width: 13px; height: 13px; }.status-pending{background:#f7edd7;color:#956a23}.status-borrowing{background:#e2edf2;color:#386779}.status-pending-return{background:#eee7f6;color:#76549a}.status-returned{background:#e5eee7;color:#2c6842}.status-overdue{background:#f5e2df;color:#a3453c}
.timeline { margin-top: 15px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.timeline div { display: flex; flex-direction: column; gap: 2px; }
.timeline span { color: #929991; font-size: .6rem; text-transform: uppercase; letter-spacing: .06em; }
.timeline strong { color: #47564d; font-size: .7rem; }.timeline strong.overdue{color:#b34239}
.card-footer { margin-top: 15px; padding-top: 12px; display: flex; align-items: center; justify-content: space-between; gap: 16px; border-top: 1px solid #eeece6; }
.card-footer p { color: #727d75; font-size: .68rem; }
.actions { display: flex; align-items: center; gap: 9px; flex: 0 0 auto; }
.actions button, .actions a { padding: 7px 9px; display: flex; align-items: center; gap: 5px; border: 0; border-radius: 8px; font-size: .64rem; font-weight: 750; cursor: pointer; }
.actions a { color: #28553d; background: #e9eee9; }.actions .cancel{color:#a3453c;background:#f8e9e7}.actions .return{color:white;background:#28553d}
.loading-state,.empty-state { min-height: 330px; padding: 50px; display: flex; align-items: center; justify-content: center; flex-direction: column; color: #889189; text-align: center; }
.loading-state { flex-direction: row; gap: 10px; }.empty-state > span{width:64px;height:64px;display:grid;place-items:center;border-radius:50%;background:#edf0eb;color:#8e9b91}.empty-state span :deep(svg){width:28px}.empty-state h2{margin:14px 0 4px;color:#294735;font-size:1.1rem}.empty-state p{font-size:.76rem}.empty-state a{margin-top:16px;padding:9px 13px;border-radius:9px;background:#28553d;color:white;font-size:.7rem;font-weight:800}
.error-state { margin: 20px; padding: 18px; display: flex; align-items: center; gap: 12px; border: 1px solid #ecc9c5; border-radius: 12px; background: #fff3f1; color: #9e4039; }.error-state div{flex:1}.error-state p{font-size:.7rem}.error-state button{padding:8px 10px;border:0;border-radius:8px;background:#9e4039;color:white;font-size:.68rem;font-weight:700}
.toast { position: fixed; z-index: 100; right: 24px; bottom: 24px; padding: 13px 17px; display: flex; align-items: center; gap: 8px; border-radius: 12px; background: #214c36; color: white; box-shadow: 0 16px 40px rgba(20,50,34,.22); font-size: .75rem; font-weight: 700; }.toast-enter-active,.toast-leave-active{transition:.25s}.toast-enter-from,.toast-leave-to{opacity:0;transform:translateY(10px)}
@media(max-width:800px){.summary-grid{grid-template-columns:repeat(2,1fr)}.borrow-hero{align-items:flex-start;flex-direction:column}.timeline{grid-template-columns:repeat(2,1fr)}.card-footer{align-items:flex-start;flex-direction:column}.actions{width:100%;flex-wrap:wrap}}
@media(max-width:560px){.borrow-page{padding:28px 14px 70px}.borrow-hero{padding:24px}.summary-grid{gap:8px}.summary-card{padding:13px}.panel-toolbar{align-items:flex-start;flex-direction:column}.refresh-button{display:none}.borrow-card{gap:12px}.cover{width:68px;height:98px}.book-title-row{flex-direction:column;gap:8px}.status{width:max-content}.timeline{grid-template-columns:1fr 1fr}.actions button,.actions a{flex:1;justify-content:center}}
</style>
