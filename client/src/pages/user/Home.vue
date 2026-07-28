<template>
  <div class="home-page">
    <section class="hero">
      <div class="hero-orb hero-orb-one"></div>
      <div class="hero-orb hero-orb-two"></div>
      <div class="hero-grid"></div>

      <div class="hero-inner">
        <div class="hero-copy">
          <div class="eyebrow"><Sparkles class="w-4 h-4" /> Không gian đọc dành cho bạn</div>
          <h1>Mỗi cuốn sách mở ra một <span>vũ trụ mới.</span></h1>
          <p>
            Khám phá kho sách được tuyển chọn từ văn học, kỹ năng, khoa học đến
            công nghệ. Tìm sách nhanh, đăng ký mượn dễ dàng và theo dõi ngay trên Spacesoul.
          </p>

          <form class="hero-search" @submit.prevent="goToBooks">
            <Search class="w-5 h-5" />
            <input v-model="searchQuery" aria-label="Tìm kiếm sách" placeholder="Tìm theo tên sách hoặc tác giả..." />
            <button type="submit">Tìm sách <ArrowRight class="w-4 h-4" /></button>
          </form>

          <div class="quick-links">
            <span>Tìm nhanh:</span>
            <button v-for="item in quickSearches" :key="item" @click="searchFor(item)">{{ item }}</button>
          </div>
        </div>

        <div class="hero-visual" aria-hidden="true">
          <div class="visual-note">
            <span class="note-icon"><Quote class="w-4 h-4" /></span>
            <p>“Một căn phòng không có sách cũng như một cơ thể không có linh hồn.”</p>
            <small>— Marcus Tullius Cicero</small>
          </div>
          <div class="book-stack">
            <div class="book book-one"><span>VĂN HỌC</span></div>
            <div class="book book-two"><span>KHÁM PHÁ</span></div>
            <div class="book book-three"><span>TRI THỨC</span></div>
          </div>
          <div class="floating-chip"><BookOpen class="w-4 h-4" /> Hơn 1.200 đầu sách</div>
        </div>
      </div>
    </section>

    <section class="stats-wrap">
      <div v-for="stat in stats" :key="stat.label" class="stat-item">
        <component :is="stat.icon" class="w-5 h-5" />
        <div><strong>{{ stat.value }}</strong><span>{{ stat.label }}</span></div>
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
            <img v-if="book.cover" :src="book.cover" :alt="`Bìa sách ${book.title}`" />
            <div v-else class="cover-placeholder"><BookOpen class="w-10 h-10" /></div>
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
              <span>{{ formatCurrency(book.price) }}đ / lượt</span>
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
  ArrowRight, ArrowUpRight, BookOpen, BrainCircuit, FlaskConical, Heart,
  Library, Quote, Search, Sparkles, Users, WalletCards
} from 'lucide-vue-next'
import { bookService } from '@/services/book'

const router = useRouter()
const books = ref([])
const searchQuery = ref('')
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

const goToBooks = () => router.push({ path: '/books', query: searchQuery.value ? { q: searchQuery.value } : {} })
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
.hero { position: relative; overflow: hidden; min-height: 650px; background: #12372d; color: white; }
.hero-grid { position: absolute; inset: 0; opacity: .12; background-image: linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px); background-size: 48px 48px; mask-image: linear-gradient(to right, #000, transparent); }
.hero-orb { position: absolute; border-radius: 999px; filter: blur(2px); }
.hero-orb-one { width: 420px; height: 420px; right: 7%; top: 4%; background: rgba(221, 171, 81, .18); }
.hero-orb-two { width: 240px; height: 240px; left: -80px; bottom: -100px; background: rgba(118, 168, 135, .2); }
.hero-inner { position: relative; z-index: 2; max-width: 1240px; min-height: 650px; margin: auto; padding: 96px 28px 84px; display: grid; grid-template-columns: 1.08fr .92fr; align-items: center; gap: 72px; }
.eyebrow, .section-kicker { display: inline-flex; align-items: center; gap: 8px; color: #d8b66a; font-size: .76rem; font-weight: 800; letter-spacing: .13em; text-transform: uppercase; }
.hero h1 { max-width: 700px; margin: 20px 0 22px; font-size: clamp(3rem, 6vw, 5.3rem); line-height: .98; letter-spacing: -.055em; }
.hero h1 span { color: #e7c87e; }
.hero-copy > p { max-width: 650px; color: rgba(255,255,255,.72); font-size: 1.03rem; line-height: 1.85; }
.hero-search { max-width: 680px; margin-top: 34px; padding: 8px 8px 8px 18px; display: flex; align-items: center; gap: 10px; background: white; color: #17372d; border-radius: 16px; box-shadow: 0 22px 60px rgba(0,0,0,.22); }
.hero-search input { min-width: 0; flex: 1; border: 0; outline: 0; padding: 10px 4px; font: inherit; color: #17372d; }
.hero-search button, .guide-link { display: inline-flex; align-items: center; gap: 8px; padding: 13px 20px; border: 0; border-radius: 11px; background: #d9aa4e; color: #17372d; font-weight: 800; cursor: pointer; }
.quick-links { margin-top: 18px; display: flex; flex-wrap: wrap; gap: 8px; align-items: center; color: rgba(255,255,255,.5); font-size: .78rem; }
.quick-links button { border: 1px solid rgba(255,255,255,.18); border-radius: 99px; padding: 5px 10px; background: rgba(255,255,255,.06); color: rgba(255,255,255,.85); cursor: pointer; }
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
  .hero-inner { grid-template-columns: 1fr; padding-top: 75px; }
  .hero-visual { display: none; }
  .book-grid, .category-grid { grid-template-columns: repeat(2, 1fr); }
  .reading-cta { grid-template-columns: 1fr; gap: 40px; }
  .guide-link { grid-column: auto; }
}
@media (max-width: 640px) {
  .hero { min-height: auto; }
  .hero-inner { min-height: auto; padding: 70px 20px 78px; }
  .hero h1 { font-size: 3.25rem; }
  .hero-search { align-items: stretch; flex-wrap: wrap; }
  .hero-search input { width: calc(100% - 40px); }
  .hero-search button { width: 100%; justify-content: center; }
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
