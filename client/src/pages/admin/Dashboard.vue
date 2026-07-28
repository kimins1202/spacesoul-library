<template>
  <div class="admin-dashboard space-y-6">
    <section class="dashboard-welcome">
      <div>
        <span class="welcome-label">Không gian vận hành thư viện</span>
        <h1>Chào mừng trở lại, {{ adminDisplayName }}</h1>
        <p>Theo dõi kho sách, yêu cầu mượn và hoạt động bạn đọc trong một màn hình.</p>
      </div>
      <div class="system-status">
        <span></span>
        Hệ thống hoạt động ổn định
      </div>
    </section>
    <!-- Stat Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Total Books -->
      <div class="metric-card bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
        <div class="flex justify-between items-start">
          <h3 class="text-xs font-bold text-gray-500 uppercase tracking-wider">Tổng số sách</h3>
          <div class="w-8 h-8 rounded-md bg-[#e2eadb] flex items-center justify-center text-[#1f3728]">
            <Library class="w-4 h-4" />
          </div>
        </div>
        <div class="mt-4">
          <h2 class="text-4xl font-bold text-[#1f3728]">{{ stats.totalBooks || 0 }}</h2>
        </div>
      </div>

      <!-- Pending Requests -->
      <div class="metric-card bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
        <div class="flex justify-between items-start">
          <h3 class="text-xs font-bold text-gray-500 uppercase tracking-wider">Yêu cầu chờ duyệt</h3>
          <div class="w-8 h-8 rounded-md bg-red-100 flex items-center justify-center text-red-600">
            <Hourglass class="w-4 h-4" />
          </div>
        </div>
        <div class="mt-4">
          <h2 class="text-4xl font-bold text-[#1f3728]">{{ stats.pendingRequests || 0 }}</h2>
          <p v-if="stats.pendingRequests > 0" class="text-xs text-red-600 mt-2 font-medium flex items-center gap-1">
            <AlertCircle class="w-3 h-3" /> Cần xử lý
          </p>
        </div>
      </div>

      <!-- Active Users -->
      <div class="metric-card bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
        <div class="flex justify-between items-start">
          <h3 class="text-xs font-bold text-gray-500 uppercase tracking-wider">Tổng độc giả</h3>
          <div class="w-8 h-8 rounded-md bg-[#e2eadb] flex items-center justify-center text-[#1f3728]">
            <UserCheck class="w-4 h-4" />
          </div>
        </div>
        <div class="mt-4">
          <h2 class="text-4xl font-bold text-[#1f3728]">{{ stats.activeUsers || 0 }}</h2>
        </div>
      </div>
    </div>

    <!-- Middle Section: Chart & Featured Book -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Chart -->
      <div class="dashboard-panel lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-lg font-bold text-[#1f3728]">Xu hướng mượn sách</h3>
          <select v-model="selectedDays" @change="loadStats" class="text-xs font-medium border border-gray-200 rounded px-2 py-1 outline-none">
            <option :value="7">7 ngày qua</option>
            <option :value="30">30 ngày qua</option>
          </select>
        </div>
        <!-- Thêm component BarChart từ vue-chartjs -->
        <div class="h-64 w-full relative">
          <Bar v-if="chartData.labels.length > 0" :data="chartData" :options="chartOptions" />
        </div>
      </div>

      <!-- Borrow status chart -->
      <div class="dashboard-panel bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <div class="mb-4">
          <h3 class="text-lg font-bold text-[#1f3728]">Trạng thái phiếu mượn</h3>
          <p class="mt-1 text-xs text-gray-500">Tổng hợp từ toàn bộ phiếu trong hệ thống</p>
        </div>
        <div class="h-52">
          <Doughnut v-if="statusChartData.datasets[0].data.some(value => value > 0)" :data="statusChartData" :options="statusChartOptions" />
          <div v-else class="h-full grid place-items-center text-sm text-gray-400">Chưa có dữ liệu mượn sách</div>
        </div>
        <div class="inventory-summary">
          <span><b>{{ stats.inventory.availableCopies }}</b> bản đang sẵn có</span>
          <span><b>{{ borrowedCopies }}</b> bản đang được giữ/mượn</span>
        </div>
      </div>
    </div>

    <!-- Bottom Section: Recent Borrows Table -->
    <div class="dashboard-panel bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="flex justify-between items-center p-6 border-b border-gray-100">
        <h3 class="text-lg font-bold text-[#1f3728]">Yêu cầu mượn gần đây</h3>
        <router-link to="/admin/borrows" class="text-sm font-semibold text-[#1f3728] hover:underline">Xem tất cả</router-link>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead class="bg-white text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
            <tr>
              <th class="px-6 py-4">Tên Sách</th>
              <th class="px-6 py-4">Người Mượn</th>
              <th class="px-6 py-4">Ngày Yêu Cầu</th>
              <th class="px-6 py-4">Trạng Thái</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-if="!stats.recentBorrows || stats.recentBorrows.length === 0">
              <td colspan="4" class="px-6 py-8 text-center text-gray-500">Chưa có yêu cầu mượn nào.</td>
            </tr>
            <tr v-for="borrow in stats.recentBorrows" :key="borrow._id" class="hover:bg-gray-50/50 transition-colors">
              <td class="px-6 py-4 flex items-center gap-4">
                <div class="w-10 h-14 bg-gray-200 rounded shadow-sm overflow-hidden flex-shrink-0">
                  <BookCover :src="borrow.book?.cover" :title="borrow.book?.title" :author="borrow.book?.author" />
                </div>
                <div>
                  <p class="text-sm font-bold text-[#1f3728]">{{ borrow.book?.title || 'Sách đã bị xóa' }}</p>
                </div>
              </td>
              <td class="px-6 py-4">
                <p class="text-sm font-medium text-gray-700">{{ borrow.reader?.lastName }} {{ borrow.reader?.firstName }}</p>
              </td>
              <td class="px-6 py-4">
                <p class="text-sm text-gray-500">{{ new Date(borrow.createdAt).toLocaleDateString('vi-VN') }}</p>
              </td>
              <td class="px-6 py-4">
                <span :class="[
                  'inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold',
                  borrow.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                  borrow.status === 'borrowing' ? 'bg-blue-100 text-blue-700' :
                  borrow.status === 'pending-return' ? 'bg-purple-100 text-purple-700' :
                  borrow.status === 'returned' ? 'bg-gray-100 text-gray-700' :
                  borrow.status === 'overdue' ? 'bg-red-100 text-red-700' :
                  'bg-gray-100 text-gray-500'
                ]">
                  {{ statusLabel(borrow.status) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Library, Hourglass, UserCheck, AlertCircle } from 'lucide-vue-next'
import { Bar, Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, ArcElement, CategoryScale, LinearScale } from 'chart.js'
import dashboardService from '@/services/dashboard'
import { authService } from '@/services/auth'
import BookCover from '@/components/books/BookCover.vue'

ChartJS.register(Title, Tooltip, Legend, BarElement, ArcElement, CategoryScale, LinearScale)

const currentAdmin = authService.getCurrentUser()
const adminDisplayName = currentAdmin?.firstName || 'Quản trị viên'

const statusLabel = (status) => {
  const map = { pending: 'Chờ duyệt', borrowing: 'Đang mượn', 'pending-return': 'Chờ trả', returned: 'Đã trả', overdue: 'Quá hạn', cancelled: 'Đã hủy' }
  return map[status] || status
}

const stats = ref({
  totalBooks: 0,
  pendingRequests: 0,
  activeUsers: 0,
  recentBorrows: [],
  borrowTrend: [],
  statusDistribution: {},
  inventory: { totalCopies: 0, availableCopies: 0 }
})

const selectedDays = ref(7)
const chartData = computed(() => ({
  labels: stats.value.borrowTrend.map(item => new Date(`${item.date}T00:00:00`).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })),
  datasets: [{
      label: 'Lượt mượn',
      backgroundColor: '#2b6246',
      hoverBackgroundColor: '#d0ad64',
      borderRadius: 4,
      data: stats.value.borrowTrend.map(item => item.count)
  }]
}))

const statusKeys = ['pending', 'borrowing', 'pending-return', 'overdue', 'returned', 'cancelled']
const statusChartData = computed(() => ({
  labels: statusKeys.map(statusLabel),
  datasets: [{
    data: statusKeys.map(key => stats.value.statusDistribution[key] || 0),
    backgroundColor: ['#d7a946', '#356c94', '#7c5fa1', '#b64b47', '#67806e', '#aab2ac'],
    borderWidth: 0,
    hoverOffset: 4
  }]
}))

const borrowedCopies = computed(() => Math.max(
  0,
  (stats.value.inventory.totalCopies || 0) - (stats.value.inventory.availableCopies || 0)
))

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#16241c',
      padding: 10,
      titleFont: { size: 13, family: 'Inter' },
      bodyFont: { size: 14, weight: 'bold', family: 'Inter' },
      displayColors: false,
      callbacks: {
        label: function(context) {
          return context.parsed.y;
        }
      }
    }
  },
  scales: {
    y: { display: false, grid: { display: false } },
    x: {
      grid: { display: false, drawBorder: false },
      ticks: { font: { size: 11, family: 'Inter' }, color: '#6b7280' }
    }
  }
})

const statusChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '68%',
  plugins: {
    legend: {
      position: 'bottom',
      labels: { boxWidth: 8, boxHeight: 8, usePointStyle: true, padding: 12, font: { size: 10 } }
    },
    tooltip: {
      callbacks: {
        label: context => `${context.label}: ${context.parsed} phiếu`
      }
    }
  }
}

const loadStats = async () => {
  try {
    stats.value = await dashboardService.getStats(selectedDays.value)
  } catch (error) {
    console.error('Lỗi khi tải thống kê:', error)
  }
}

onMounted(() => {
  loadStats()
})
</script>

<style scoped>
.font-title {
  font-family: 'Be Vietnam Pro', sans-serif;
}

.dashboard-welcome {
  min-height: 150px;
  padding: 30px 34px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  border: 1px solid rgba(255,255,255,.11);
  border-radius: 20px;
  color: white;
  background:
    radial-gradient(circle at 85% 0%, rgba(224, 189, 112, .23), transparent 20rem),
    linear-gradient(135deg, #15392a, #214b37);
  box-shadow: 0 18px 40px rgba(20, 53, 38, .15);
}

.welcome-label {
  display: block;
  margin-bottom: 8px;
  color: #dfbd75;
  font-size: .68rem;
  font-weight: 800;
  letter-spacing: .13em;
  text-transform: uppercase;
}

.dashboard-welcome h1 {
  margin-bottom: 6px;
  font-size: clamp(1.5rem, 3vw, 2.15rem);
  letter-spacing: -.035em;
}

.dashboard-welcome p {
  color: rgba(255,255,255,.62);
  font-size: .84rem;
}

.system-status {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border: 1px solid rgba(255,255,255,.12);
  border-radius: 999px;
  background: rgba(255,255,255,.07);
  color: rgba(255,255,255,.76);
  font-size: .7rem;
  font-weight: 700;
}

.system-status span {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #7ee2a0;
  box-shadow: 0 0 0 4px rgba(126,226,160,.13);
}

.metric-card,
.dashboard-panel {
  border-color: rgba(31,55,40,.08);
  border-radius: 18px;
  box-shadow: 0 10px 30px rgba(23,55,43,.055);
}

.metric-card {
  position: relative;
  overflow: hidden;
  transition: transform .25s ease, box-shadow .25s ease;
}

.metric-card::after {
  content: "";
  position: absolute;
  right: -28px;
  bottom: -42px;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: rgba(31,55,40,.035);
}

.metric-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 16px 36px rgba(23,55,43,.09);
}

.featured-panel {
  border-radius: 18px;
  background:
    radial-gradient(circle at 100% 100%, rgba(224,189,112,.22), transparent 15rem),
    linear-gradient(145deg, #244e39, #173527);
  box-shadow: 0 16px 36px rgba(23,55,43,.16);
}

.inventory-summary {
  margin-top: 14px;
  padding-top: 14px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  border-top: 1px solid #e6e9e4;
}

.inventory-summary span {
  padding: 8px;
  border-radius: 9px;
  background: #f3f5f1;
  color: #69756d;
  font-size: .66rem;
  line-height: 1.4;
}

.inventory-summary b {
  display: block;
  color: #234532;
  font-size: .9rem;
}

@media (max-width: 767px) {
  .dashboard-welcome {
    align-items: flex-start;
    flex-direction: column;
    padding: 24px;
  }
}
</style>
