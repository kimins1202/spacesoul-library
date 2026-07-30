<template>
  <div class="home-page">
    <section class="hero">
      <div class="hero-inner">
        <div class="hero-copy">
          <span class="hero-label"><Library class="w-4 h-4" /> Thư viện Spacesoul</span>
          <h1>Khám phá Tri thức Việt</h1>
          <p>
            Hành trình tìm kiếm cảm hứng bắt đầu từ những trang sách.
            Khám phá kho tàng tri thức đa dạng từ văn học nghệ thuật đến công nghệ hiện đại.
          </p>

          <form class="hero-search" @submit.prevent="goToBooks">
            <div class="search-field">
              <Search class="w-4 h-4" />
              <input v-model="searchQuery" aria-label="Tìm kiếm sách" placeholder="Tìm tên sách hoặc tác giả..." />
            </div>
            <select v-model="selectedCategory" aria-label="Chọn thể loại">
              <option value="">Tất cả thể loại</option>
              <option value="vanhoc">Văn học</option>
              <option value="kynang">Kỹ năng</option>
              <option value="khoahoc">Khoa học</option>
              <option value="congnghe">Công nghệ</option>
              <option value="taichinh">Tài chính</option>
              <option value="thieunhi">Thiếu nhi</option>
            </select>
            <select v-model="selectedStatus" aria-label="Chọn trạng thái">
              <option value="all">Trạng thái: Tất cả</option>
              <option value="available">Sách còn sẵn</option>
              <option value="borrowed">Đang được mượn</option>
            </select>
            <button type="submit"><Filter class="w-4 h-4" /> Lọc kết quả</button>
          </form>

          <div class="quick-links">
            <span>Tìm kiếm phổ biến</span>
            <button v-for="item in quickSearches" :key="item" type="button" @click="searchFor(item)">{{ item }}</button>
          </div>
        </div>
      </div>
    </section>

    <section class="section-shell">
      <div class="section-heading">
        <div>
          <span class="section-kicker">Gợi ý hôm nay</span>
          <h2>Sách mới dành cho bạn</h2>
          <p>Những tựa sách vừa được bổ sung vào thư viện Spacesoul.</p>
        </div>
        <router-link to="/books" class="text-link">Xem toàn bộ <ArrowUpRight class="w-4 h-4" /></router-link>
      </div>

      <div v-if="isLoading" class="book-grid">
        <div v-for="index in 4" :key="index" class="book-skeleton"></div>
      </div>
      <div v-else-if="featuredBooks.length" class="book-grid">
        <router-link v-for="book in featuredBooks" :key="book._id" :to="`/books/${book._id}`" class="featured-card">
          <div class="cover-wrap">
            <BookCover :src="book.cover" :title="book.title" :author="book.author" />
            <span :class="['availability', { unavailable: !book.availableCopies }]">
              {{ book.availableCopies ? `Còn ${book.availableCopies} cuốn` : 'Đang hết sách' }}
            </span>
          </div>
          <div class="card-body">
            <span class="category">{{ categoryLabel(book.category) }}</span>
            <h3>{{ book.title }}</h3>
            <p>{{ book.author }}</p>
            <div class="book-meta">
              <span>{{ book.publishYear || 'Đang cập nhật' }}</span>
              <span>{{ formatCurrency(book.price) }} đ / lượt</span>
            </div>
          </div>
        </router-link>
      </div>
      <div v-else class="empty-books">
        <BookOpen class="w-10 h-10" />
        <h3>Kho sách đang được cập nhật</h3>
        <p>Khởi tạo dữ liệu mẫu để xem các đầu sách mới nhất.</p>
      </div>
    </section>

    <section class="category-section">
      <div class="section-shell">
        <div class="section-heading compact">
          <div>
            <span class="section-kicker light">Đọc theo sở thích</span>
            <h2>Chọn một chủ đề để bắt đầu</h2>
          </div>
        </div>
        <div class="category-grid">
          <button v-for="category in categories" :key="category.name" @click="searchFor(category.query)" class="category-card">
            <span class="category-icon"><component :is="category.icon" /></span>
            <span><strong>{{ category.name }}</strong><small>{{ category.description }}</small></span>
            <ArrowUpRight class="category-arrow" />
          </button>
        </div>
      </div>
    </section>

    <section class="section-shell reading-cta">
      <div>
        <span class="section-kicker">Bắt đầu chỉ trong vài phút</span>
        <h2>Mượn sách đơn giản, đọc sách trọn vẹn.</h2>
      </div>
      <div class="steps">
        <div v-for="(step, index) in steps" :key="step.title" class="step">
          <span>0{{ index + 1 }}</span>
          <div><strong>{{ step.title }}</strong><p>{{ step.description }}</p></div>
        </div>
      </div>
      <router-link to="/guide" class="guide-link">Xem hướng dẫn mượn sách <ArrowRight class="w-4 h-4" /></router-link>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  ArrowRight, ArrowUpRight, BookOpen, BrainCircuit, Filter, FlaskConical,
  Heart, Library, Search, Users, WalletCards
} from 'lucide-vue-next'
import { bookService } from '@/services/book'
import BookCover from '@/components/books/BookCover.vue'

const router = useRouter()
const books = ref([])
const searchQuery = ref('')
const selectedCategory = ref('')
const selectedStatus = ref('all')
const isLoading = ref(true)
const quickSearches = ['Văn học', 'Kỹ năng', 'Công nghệ']

const stats = [
  { value: '1.200+', label: 'Đầu sách', icon: Library },
  { value: '28', label: 'Chủ đề', icon: BookOpen },
  { value: '3.500+', label: 'Bạn đọc', icon: Users },
  { value: '4,9/5', label: 'Mức hài lòng', icon: Heart }
]

const categories = [
  { name: 'Văn học', query: 'vanhoc', description: 'Tiểu thuyết & tác phẩm Việt', icon: BookOpen },
  { name: 'Kỹ năng', query: 'kynang', description: 'Phát triển bản thân', icon: BrainCircuit },
  { name: 'Khoa học', query: 'khoahoc', description: 'Hiểu thêm về thế giới', icon: FlaskConical },
  { name: 'Tài chính', query: 'taichinh', description: 'Tư duy & quản lý tiền', icon: WalletCards }
]

const steps = [
  { title: 'Tìm cuốn sách bạn thích', description: 'Tra cứu theo tên, tác giả hoặc thể loại.' },
  { title: 'Thêm vào giỏ mượn', description: 'Kiểm tra số lượng và đăng ký trực tuyến.' },
  { title: 'Nhận sách tại thư viện', description: 'Chờ xác nhận và đến nhận sách đúng hẹn.' }
]

const featuredBooks = computed(() => [...books.value]
  .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
  .slice(0, 4))

const formatCurrency = value => new Intl.NumberFormat('vi-VN').format(value || 0)
const categoryLabel = value => ({
  vanhoc: 'Văn học', kynang: 'Kỹ năng', khoahoc: 'Khoa học',
  taichinh: 'Tài chính', congnghe: 'Công nghệ', thieunhi: 'Thiếu nhi'
}[value] || value || 'Sách')

const goToBooks = () => {
  const query = {}
  if (searchQuery.value.trim()) query.q = searchQuery.value.trim()
  if (selectedCategory.value) query.category = selectedCategory.value
  if (selectedStatus.value !== 'all') query.status = selectedStatus.value
  router.push({ path: '/books', query })
}
const searchFor = value => router.push({ path: '/books', query: { q: value } })

onMounted(async () => {
  try {
    const response = await bookService.getBooks()
    books.value = Array.isArray(response) ? response : (response.data || [])
  } catch (error) {
    console.error('Không thể tải sách mới:', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
.home-page { background: #f8f7f2; color: #17372d; }
.hero {
  position: relative;
  overflow: hidden;
  min-height: 430px;
  color: #fff;
  background:
    linear-gradient(100deg, rgba(12,39,27,.94) 0%, rgba(19,52,37,.86) 52%, rgba(16,42,30,.76) 100%),
    url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=85&w=2000&auto=format&fit=crop') center 48% / cover;
  border-bottom: 1px solid #d4c18c;
  box-shadow: 0 14px 34px rgba(20, 49, 34, .13);
}
.hero::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 50% 5%, rgba(226,195,126,.16), transparent 30rem),
    linear-gradient(180deg, transparent 65%, rgba(8,27,18,.18));
  pointer-events: none;
}
.hero-inner { position: relative; z-index: 2; max-width: 1240px; min-height: 430px; margin: auto; padding: 80px 28px 54px; display: flex; align-items: center; justify-content: center; }
.hero-copy {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.hero-label { display: inline-flex; align-items: center; gap: 7px; color: #e5c77f; font-size: .7rem; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; }
.section-kicker { display: inline-flex; align-items: center; gap: 8px; color: #b48535; font-size: .76rem; font-weight: 800; letter-spacing: .13em; text-transform: uppercase; }
.hero h1 { width: 100%; margin: 16px auto 10px; text-align: center; font-size: clamp(2.2rem, 5vw, 3.8rem); line-height: 1.08; letter-spacing: -.045em; color: #fff; text-shadow: 0 2px 18px rgba(0,0,0,.18); }
.hero-copy > p { max-width: 720px; margin: 0 auto; color: rgba(255,255,255,.72); font-size: .92rem; line-height: 1.75; }
.hero-search { width: 100%; margin: 34px auto 0; padding: 7px; display: grid; grid-template-columns: minmax(260px, 1fr) 180px 190px auto; align-items: center; gap: 7px; border: 1px solid #d9dad3; background: #fff; border-radius: 13px; box-shadow: 0 12px 30px rgba(32,57,42,.07); text-align: left; }
.search-field { min-width: 0; display: flex; align-items: center; gap: 9px; padding: 0 12px; color: #809087; }
.hero-search input, .hero-search select { width: 100%; border: 0; outline: 0; padding: 11px 8px; background: transparent; color: #37443c; font-size: .78rem; }
.hero-search select { border-left: 1px solid #e7e3da; cursor: pointer; }
.hero-search button, .guide-link { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 12px 18px; border: 0; border-radius: 9px; background: #254f3a; color: white; font-weight: 800; font-size: .76rem; cursor: pointer; }
.hero-search button:hover { background: #173a29; }
.quick-links { width: 100%; margin-top: 16px; display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; align-items: center; color: rgba(255,255,255,.58); font-size: .7rem; }
.quick-links button { border: 1px solid rgba(255,255,255,.2); border-radius: 99px; padding: 5px 10px; background: rgba(255,255,255,.1); color: rgba(255,255,255,.82); backdrop-filter: blur(8px); cursor: pointer; }
.quick-links button:hover { border-color: rgba(229,199,127,.65); background: rgba(255,255,255,.16); color: #fff; }
.hero-visual { position: relative; min-height: 450px; }
.book-stack { position: absolute; right: 9%; bottom: 18px; width: 290px; height: 390px; transform: rotate(3deg); }
.book { position: absolute; bottom: 0; width: 210px; height: 340px; padding: 26px; display: flex; align-items: flex-end; border-radius: 8px 16px 16px 8px; box-shadow: -14px 22px 42px rgba(0,0,0,.32), inset 8px 0 rgba(255,255,255,.1); font-weight: 800; letter-spacing: .18em; }
.book-one { left: -80px; transform: rotate(-13deg); background: #b65d43; }
.book-two { left: 8px; transform: rotate(-4deg); background: #cf9d42; color: #17372d; }
.book-three { left: 92px; transform: rotate(7deg); background: #e9ddc2; color: #17372d; }
.visual-note { position: absolute; z-index: 4; left: -20px; top: 14px; width: 270px; padding: 24px; border: 1px solid rgba(255,255,255,.17); border-radius: 18px; background: rgba(255,255,255,.09); backdrop-filter: blur(16px); }
.visual-note p { margin: 10px 0; font-family: Georgia, serif; font-size: 1rem; line-height: 1.6; }
.visual-note small { color: rgba(255,255,255,.55); }
.note-icon { display: grid; place-items: center; width: 32px; height: 32px; border-radius: 50%; background: #d9aa4e; color: #17372d; }
.floating-chip { position: absolute; z-index: 5; right: -4px; top: 120px; display: flex; align-items: center; gap: 8px; padding: 12px 16px; border-radius: 99px; background: white; color: #17372d; font-size: .78rem; font-weight: 800; box-shadow: 0 16px 40px rgba(0,0,0,.2); }
.stats-wrap { position: relative; z-index: 4; max-width: 1120px; margin: -34px auto 0; padding: 22px 30px; display: grid; grid-template-columns: repeat(4, 1fr); border: 1px solid #e9e4d8; border-radius: 18px; background: white; box-shadow: 0 18px 50px rgba(31,55,40,.09); }
.stat-item { display: flex; align-items: center; justify-content: center; gap: 13px; border-right: 1px solid #ece8df; color: #b48535; }
.stat-item:last-child { border: 0; }
.stat-item div { display: flex; flex-direction: column; }
.stat-item strong { color: #17372d; font-size: 1.22rem; }
.stat-item span { color: #7c877f; font-size: .73rem; }
.section-shell { max-width: 1240px; margin: auto; padding: 100px 28px; }
.section-heading { margin-bottom: 34px; display: flex; align-items: flex-end; justify-content: space-between; gap: 20px; }
.section-heading h2, .reading-cta h2 { margin: 8px 0 7px; font-size: clamp(2rem, 4vw, 3.1rem); letter-spacing: -.04em; }
.section-heading p { color: #758078; }
.text-link { display: inline-flex; align-items: center; gap: 6px; font-size: .84rem; font-weight: 800; }
.book-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 22px; }
.featured-card { overflow: hidden; border: 1px solid #e9e4d8; border-radius: 18px; background: #fff; box-shadow: 0 8px 24px rgba(31,55,40,.04); transition: .25s ease; }
.featured-card:hover { transform: translateY(-7px); box-shadow: 0 20px 38px rgba(31,55,40,.12); }
.cover-wrap { position: relative; aspect-ratio: 4 / 4.6; overflow: hidden; background: #e7e3da; }
.cover-wrap img { width: 100%; height: 100%; object-fit: cover; transition: transform .5s ease; }
.featured-card:hover img { transform: scale(1.045); }
.cover-placeholder { width: 100%; height: 100%; display: grid; place-items: center; color: #9aa49d; }
.availability { position: absolute; top: 12px; right: 12px; padding: 6px 9px; border-radius: 99px; background: #e9f5ea; color: #2d713e; font-size: .64rem; font-weight: 800; }
.availability.unavailable { background: #f0ece6; color: #846d5d; }
.card-body { padding: 18px; }
.category { color: #ad7d2e; font-size: .67rem; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; }
.card-body h3 { min-height: 48px; margin: 8px 0 4px; font-size: 1.03rem; }
.card-body > p { color: #768078; font-size: .8rem; }
.book-meta { margin-top: 15px; padding-top: 12px; display: flex; justify-content: space-between; gap: 10px; border-top: 1px solid #eeeae2; color: #738078; font-size: .68rem; font-weight: 700; }
.book-skeleton { height: 430px; border-radius: 18px; background: linear-gradient(100deg, #ebe8df 20%, #f7f5ef 40%, #ebe8df 60%); background-size: 200% 100%; animation: shimmer 1.4s infinite; }
.empty-books { padding: 60px; display: grid; place-items: center; text-align: center; border: 1px dashed #d9d1c1; border-radius: 18px; color: #7b857e; }
.empty-books h3 { margin-top: 12px; color: #17372d; }
.category-section { background: #17372d; color: white; }
.section-heading.compact { margin-bottom: 30px; }
.section-heading.compact h2 { margin-bottom: 0; }
.section-kicker.light { color: #e7c87e; }
.category-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
.category-card { min-height: 150px; padding: 22px; display: flex; align-items: center; gap: 14px; text-align: left; border: 1px solid rgba(255,255,255,.12); border-radius: 16px; background: rgba(255,255,255,.055); color: white; cursor: pointer; transition: .25s ease; }
.category-card:hover { transform: translateY(-4px); border-color: rgba(231,200,126,.5); background: rgba(255,255,255,.09); }
.category-icon { flex: 0 0 auto; width: 45px; height: 45px; display: grid; place-items: center; border-radius: 13px; background: #e7c87e; color: #17372d; }
.category-icon :deep(svg) { width: 21px; }
.category-card > span:nth-child(2) { display: flex; flex-direction: column; gap: 5px; }
.category-card small { color: rgba(255,255,255,.54); font-size: .69rem; }
.category-arrow { width: 17px; margin-left: auto; color: rgba(255,255,255,.45); }
.reading-cta { display: grid; grid-template-columns: .85fr 1.15fr; gap: 60px 90px; align-items: start; }
.steps { display: grid; gap: 22px; }
.step { display: flex; gap: 18px; padding-bottom: 20px; border-bottom: 1px solid #ddd8cc; }
.step > span { color: #c1903a; font-weight: 900; font-size: .77rem; }
.step strong { display: block; margin-bottom: 4px; }
.step p { color: #778178; font-size: .84rem; }
.guide-link { width: max-content; grid-column: 1; }
@keyframes shimmer { to { background-position: -200% 0; } }
@media (max-width: 960px) {
  .hero-inner { padding-top: 70px; }
  .hero-visual { display: none; }
  .hero-search { grid-template-columns: 1fr 1fr; }
  .search-field { grid-column: 1 / -1; }
  .hero-search button { width: 100%; }
  .book-grid, .category-grid { grid-template-columns: repeat(2, 1fr); }
  .reading-cta { grid-template-columns: 1fr; gap: 40px; }
  .guide-link { grid-column: auto; }
}
@media (max-width: 640px) {
  .hero { min-height: auto; }
  .hero-inner { min-height: auto; padding: 62px 20px 48px; }
  .hero h1 { font-size: 2.55rem; }
  .hero-search { grid-template-columns: 1fr; }
  .search-field, .hero-search select { grid-column: auto; }
  .hero-search select { border-left: 0; border-top: 1px solid #e7e3da; }
  .stats-wrap { margin: 0; padding: 20px; grid-template-columns: repeat(2, 1fr); border-radius: 0; }
  .stat-item { padding: 10px; border: 0; justify-content: flex-start; }
  .section-shell { padding: 72px 20px; }
  .section-heading { align-items: flex-start; flex-direction: column; }
  .book-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
  .card-body { padding: 13px; }
  .card-body h3 { font-size: .9rem; }
  .book-meta { flex-direction: column; }
  .category-grid { grid-template-columns: 1fr; }
}
</style>
