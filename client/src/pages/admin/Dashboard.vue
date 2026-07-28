<template>
  <div class="space-y-6">
    <!-- Stat Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Total Books -->
      <div class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
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
      <div class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
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
      <div class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
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
      <div class="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-lg font-bold text-[#1f3728]">Xu hướng mượn sách</h3>
          <select class="text-xs font-medium border border-gray-200 rounded px-2 py-1 outline-none">
            <option>7 ngày qua</option>
            <option>30 ngày qua</option>
          </select>
        </div>
        <!-- Thêm component BarChart từ vue-chartjs -->
        <div class="h-64 w-full relative">
          <Bar v-if="chartData.labels.length > 0" :data="chartData" :options="chartOptions" />
        </div>
      </div>

      <!-- Featured Book Card -->
      <div class="bg-[#2c4c3b] rounded-xl p-8 flex flex-col justify-between relative overflow-hidden text-white shadow-md">
        <!-- Background Icon -->
        <BookOpen class="absolute -right-4 -bottom-4 w-40 h-40 text-white/5" />
        
        <div class="relative z-10">
          <h3 class="text-xl font-bold mb-4 font-title">Tiêu điểm</h3>
          <p class="text-white/80 text-sm leading-relaxed mb-6 font-medium italic">
            Quản lý sách hiệu quả, luôn theo dõi sát sao tình trạng mượn trả để phục vụ bạn đọc tốt nhất.
          </p>
        </div>
        
        <router-link to="/admin/books" class="relative z-10 text-center bg-[#aed581] text-[#1f3728] w-full py-3 rounded text-sm font-bold shadow-sm hover:bg-[#c5e1a5] transition-colors block">
          Quản lý sách ngay
        </router-link>
      </div>
    </div>

    <!-- Bottom Section: Recent Borrows Table -->
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
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
                  <img v-if="borrow.book?.cover" :src="borrow.book.cover" class="w-full h-full object-cover">
                  <div v-else class="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Cover</div>
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
import { ref, onMounted } from 'vue'
import { Library, Hourglass, UserCheck, TrendingUp, AlertCircle, ArrowUp, CheckCircle, XCircle, BookOpen } from 'lucide-vue-next'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import dashboardService from '@/services/dashboard'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const statusLabel = (status) => {
  const map = { pending: 'Chờ duyệt', borrowing: 'Đang mượn', 'pending-return': 'Chờ trả', returned: 'Đã trả', overdue: 'Quá hạn', cancelled: 'Đã hủy' }
  return map[status] || status
}

const stats = ref({
  totalBooks: 0,
  pendingRequests: 0,
  activeUsers: 0,
  recentBorrows: []
})

const chartData = ref({
  labels: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'],
  datasets: [
    {
      label: 'Lượt mượn',
      backgroundColor: ['#e2eadb', '#e2eadb', '#e2eadb', '#e2eadb', '#e2eadb', '#e2eadb', '#1f3728'],
      borderRadius: 4,
      data: [180, 220, 190, 280, 250, 210, 390]
    }
  ]
})

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

const loadStats = async () => {
  try {
    stats.value = await dashboardService.getStats()
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
  font-family: 'Inter', sans-serif;
}
</style>
