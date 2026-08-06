<template>
  <div class="guide-page">
    <section class="guide-hero">
      <div class="hero-orbit orbit-one"></div>
      <div class="hero-orbit orbit-two"></div>
      <div class="guide-container hero-content">
        <div class="hero-copy">
          <span class="eyebrow"><BookMarked /> Cẩm nang Spacesoul</span>
          <h1>Mượn sách dễ dàng,<br><em>đọc sách trọn vẹn.</em></h1>
          <p>
            Từ lúc tìm thấy cuốn sách yêu thích đến khi hoàn trả, bạn chỉ cần
            thực hiện bốn bước rõ ràng trên hệ thống.
          </p>
          <div class="hero-actions">
            <router-link to="/books" class="primary-link">
              Khám phá sách <ArrowRight />
            </router-link>
            <a href="#quy-trinh" class="text-link">Xem quy trình</a>
          </div>
        </div>

        <div class="hero-summary" aria-label="Thông tin mượn sách">
          <div>
            <span>Thời hạn tiêu chuẩn</span>
            <strong>14 ngày</strong>
          </div>
          <div>
            <span>Số sách tối đa</span>
            <strong>10 cuốn</strong>
          </div>
          <div>
            <span>Xử lý yêu cầu</span>
            <strong>Tại thư viện</strong>
          </div>
        </div>
      </div>
    </section>

    <main class="guide-container guide-main">
      <section id="quy-trinh" class="process-section">
        <header class="section-heading">
          <div>
            <span class="section-label">Quy trình mượn – trả</span>
            <h2>Bốn bước, một hành trình liền mạch</h2>
          </div>
          <p>Mỗi trạng thái đều được cập nhật trong mục “Yêu cầu mượn” của bạn.</p>
        </header>

        <div class="process-list">
          <article v-for="step in steps" :key="step.number" class="process-card">
            <div class="step-number">{{ step.number }}</div>
            <div class="step-icon"><component :is="step.icon" /></div>
            <div class="step-content">
              <span>{{ step.kicker }}</span>
              <h3>{{ step.title }}</h3>
              <p>{{ step.description }}</p>
              <ul>
                <li v-for="note in step.notes" :key="note"><Check />{{ note }}</li>
              </ul>
            </div>
          </article>
        </div>
      </section>

      <section class="status-section">
        <div class="status-copy">
          <span class="section-label light">Theo dõi minh bạch</span>
          <h2>Hiểu trạng thái yêu cầu của bạn</h2>
          <p>
            Hệ thống sử dụng các trạng thái ngắn gọn để bạn luôn biết sách đang
            ở bước nào và cần thực hiện hành động gì tiếp theo.
          </p>
          <router-link to="/borrowed">Xem yêu cầu của tôi <ArrowRight /></router-link>
        </div>

        <div class="status-flow">
          <div v-for="(status, index) in statuses" :key="status.name" class="status-item">
            <div class="status-marker"><component :is="status.icon" /></div>
            <div>
              <span>{{ status.code }}</span>
              <strong>{{ status.name }}</strong>
              <p>{{ status.description }}</p>
            </div>
            <ArrowRight v-if="index < statuses.length - 1" class="flow-arrow" />
          </div>
        </div>
      </section>

      <section class="notice-grid">
        <article class="notice-card">
          <div class="notice-icon"><Clock3 /></div>
          <div>
            <span>Đúng hạn</span>
            <h3>Trả sách trước ngày đến hạn</h3>
            <p>Tài khoản có sách quá hạn sẽ tạm thời không thể gửi thêm yêu cầu mượn.</p>
          </div>
        </article>
        <article class="notice-card">
          <div class="notice-icon"><MapPin /></div>
          <div>
            <span>Nhận và trả sách</span>
            <h3>Thực hiện tại quầy thư viện</h3>
            <p>Mang theo thông tin tài khoản để đối chiếu khi nhận sách.</p>
          </div>
        </article>
        <article class="notice-card">
          <div class="notice-icon"><ShieldCheck /></div>
          <div>
            <span>Bảo quản</span>
            <h3>Giữ sách nguyên vẹn</h3>
            <p>Không viết, gấp trang hoặc làm hư hỏng sách trong thời gian mượn.</p>
          </div>
        </article>
      </section>

      <section class="faq-section">
        <header class="faq-heading">
          <span class="section-label">Hỗ trợ nhanh</span>
          <h2>Câu hỏi thường gặp</h2>
          <p>Những điều bạn nên biết trước khi bắt đầu mượn sách.</p>
        </header>

        <div class="faq-list">
          <article
            v-for="(item, index) in faqs"
            :key="item.question"
            :class="['faq-item', { open: openFaq === index }]"
          >
            <button
              type="button"
              :aria-expanded="openFaq === index"
              @click="openFaq = openFaq === index ? null : index"
            >
              <span><CircleHelp />{{ item.question }}</span>
              <ChevronDown />
            </button>
            <div v-if="openFaq === index" class="faq-answer">
              <p>{{ item.answer }}</p>
            </div>
          </article>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import './Guide.css'
import {
  AlertCircle,
  ArrowRight,
  BookMarked,
  Check,
  ChevronDown,
  CircleCheck,
  CircleHelp,
  Clock3,
  Hourglass,
  LibraryBig,
  MapPin,
  RotateCcw,
  Search,
  ShieldCheck,
  ShoppingBag
} from 'lucide-vue-next'

const openFaq = ref(0)

const steps = [
  {
    number: '01',
    kicker: 'Khám phá',
    title: 'Tìm cuốn sách phù hợp',
    icon: Search,
    description: 'Tìm theo tên sách hoặc tác giả, sau đó lọc theo thể loại và trạng thái còn sách.',
    notes: ['Xem phí mượn và số bản còn lại', 'Đọc thông tin chi tiết trước khi chọn']
  },
  {
    number: '02',
    kicker: 'Gửi yêu cầu',
    title: 'Mượn ngay hoặc dùng giỏ mượn',
    icon: ShoppingBag,
    description: 'Gửi từng yêu cầu tại trang chi tiết hoặc chọn nhiều sách trong giỏ mượn.',
    notes: ['Cần đăng nhập tài khoản độc giả', 'Mỗi yêu cầu sẽ giữ trước một bản sách']
  },
  {
    number: '03',
    kicker: 'Nhận sách',
    title: 'Chờ duyệt và đến thư viện',
    icon: LibraryBig,
    description: 'Theo dõi trạng thái yêu cầu. Khi được duyệt, bạn đến quầy thư viện để nhận sách.',
    notes: ['Thời hạn được tính từ ngày duyệt', 'Trạng thái được cập nhật trên hệ thống']
  },
  {
    number: '04',
    kicker: 'Hoàn trả',
    title: 'Trả sách trực tiếp',
    icon: RotateCcw,
    description: 'Nhấn Trả sách để hoàn tất ngay. Hệ thống tự cập nhật lịch sử và số bản có thể mượn.',
    notes: ['Không cần gửi yêu cầu hoặc chờ duyệt', 'Lịch sử mượn vẫn được lưu']
  }
]

const statuses = [
  { code: '01', name: 'Chờ duyệt', description: 'Yêu cầu đã được gửi.', icon: Hourglass },
  { code: '02', name: 'Đang mượn', description: 'Yêu cầu đã được phê duyệt.', icon: BookMarked },
  { code: '03', name: 'Đã trả', description: 'Bạn đã hoàn tất trả sách.', icon: CircleCheck }
]

const faqs = [
  {
    question: 'Tôi có thể mượn tối đa bao nhiêu cuốn?',
    answer: 'Bạn có thể có tối đa 10 yêu cầu đang hoạt động, bao gồm chờ duyệt, đang mượn và quá hạn.'
  },
  {
    question: 'Thời hạn mượn được tính như thế nào?',
    answer: 'Thời hạn tiêu chuẩn là 14 ngày và bắt đầu tính từ thời điểm yêu cầu mượn được phê duyệt.'
  },
  {
    question: 'Tôi có thể hủy yêu cầu đã gửi không?',
    answer: 'Yêu cầu đã gửi không thể tự hủy. Vui lòng liên hệ thư viện nếu cần hỗ trợ.'
  },
  {
    question: 'Điều gì xảy ra khi sách bị quá hạn?',
    answer: 'Yêu cầu sẽ chuyển sang trạng thái quá hạn và tài khoản không thể mượn thêm sách cho đến khi hoàn tất trả sách.'
  }
]
</script>
