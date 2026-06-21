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
          <h2 class="text-4xl font-bold text-[#1f3728]">12,842</h2>
          <p class="text-xs text-gray-500 mt-2 font-medium flex items-center gap-1">
            <TrendingUp class="w-3 h-3 text-[#1f3728]" /> 
            <span class="text-[#1f3728]">+12%</span> so với tháng trước
          </p>
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
          <h2 class="text-4xl font-bold text-[#1f3728]">48</h2>
          <p class="text-xs text-red-600 mt-2 font-medium flex items-center gap-1">
            <AlertCircle class="w-3 h-3" /> Cần xử lý ngay lập tức
          </p>
        </div>
      </div>

      <!-- Active Users -->
      <div class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
        <div class="flex justify-between items-start">
          <h3 class="text-xs font-bold text-gray-500 uppercase tracking-wider">Người dùng hoạt động</h3>
          <div class="w-8 h-8 rounded-md bg-[#e2eadb] flex items-center justify-center text-[#1f3728]">
            <UserCheck class="w-4 h-4" />
          </div>
        </div>
        <div class="mt-4">
          <h2 class="text-4xl font-bold text-[#1f3728]">1,204</h2>
          <p class="text-xs text-gray-500 mt-2 font-medium flex items-center gap-1">
            <ArrowUp class="w-3 h-3 text-[#1f3728]" /> 
            <span class="text-gray-600">82 người đang trực tuyến</span>
          </p>
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
          <h3 class="text-xl font-bold mb-4 font-title">Tiêu điểm sách mới</h3>
          <p class="text-white/80 text-sm leading-relaxed mb-6 font-medium italic">
            "Kiến trúc của sự tĩnh lặng" đã được yêu cầu 42 lần trong sáng nay.
          </p>
        </div>
        
        <button class="relative z-10 bg-[#aed581] text-[#1f3728] w-full py-3 rounded text-sm font-bold shadow-sm hover:bg-[#c5e1a5] transition-colors">
          Nhập thêm bản sao
        </button>
      </div>
    </div>

    <!-- Bottom Section: Recent Borrows Table -->
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="flex justify-between items-center p-6 border-b border-gray-100">
        <h3 class="text-lg font-bold text-[#1f3728]">Yêu cầu mượn gần đây</h3>
        <button class="text-sm font-semibold text-[#1f3728] hover:underline">Xem tất cả</button>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead class="bg-white text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
            <tr>
              <th class="px-6 py-4">Tên Sách</th>
              <th class="px-6 py-4">Người Mượn</th>
              <th class="px-6 py-4">Ngày Yêu Cầu</th>
              <th class="px-6 py-4">Trạng Thái</th>
              <th class="px-6 py-4 text-center">Hành Động</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <!-- Row 1 -->
            <tr class="hover:bg-gray-50/50 transition-colors">
              <td class="px-6 py-4 flex items-center gap-4">
                <div class="w-10 h-14 bg-gray-200 rounded shadow-sm overflow-hidden flex-shrink-0">
                  <img src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=100&auto=format&fit=crop" class="w-full h-full object-cover">
                </div>
                <div>
                  <p class="text-sm font-bold text-[#1f3728]">Vang vọng từ hư không</p>
                  <p class="text-xs text-gray-500 mt-0.5">ISBN: 978-3-16-148410-0</p>
                </div>
              </td>
              <td class="px-6 py-4">
                <p class="text-sm font-medium text-gray-700">Julian Thorne</p>
              </td>
              <td class="px-6 py-4">
                <p class="text-sm text-gray-500">24 tháng 10, 2024</p>
              </td>
              <td class="px-6 py-4">
                <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#e2eadb] text-[#1f3728]">
                  Đang chờ
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex justify-center gap-3">
                  <button class="text-gray-400 hover:text-[#1f3728] transition-colors"><CheckCircle class="w-5 h-5" /></button>
                  <button class="text-gray-400 hover:text-red-500 transition-colors"><XCircle class="w-5 h-5" /></button>
                </div>
              </td>
            </tr>

            <!-- Row 2 -->
            <tr class="hover:bg-gray-50/50 transition-colors">
              <td class="px-6 py-4 flex items-center gap-4">
                <div class="w-10 h-14 bg-gray-200 rounded shadow-sm overflow-hidden flex-shrink-0">
                  <img src="https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=100&auto=format&fit=crop" class="w-full h-full object-cover">
                </div>
                <div>
                  <p class="text-sm font-bold text-[#1f3728]">Dòng chảy đô thị</p>
                  <p class="text-xs text-gray-500 mt-0.5">ISBN: 978-1-86-198212-3</p>
                </div>
              </td>
              <td class="px-6 py-4">
                <p class="text-sm font-medium text-gray-700">Elena Soros</p>
              </td>
              <td class="px-6 py-4">
                <p class="text-sm text-gray-500">23 tháng 10, 2024</p>
              </td>
              <td class="px-6 py-4">
                <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#e2eadb] text-[#1f3728]">
                  Đã đặt trước
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex justify-center gap-3">
                  <button class="text-gray-400 hover:text-[#1f3728] transition-colors"><CheckCircle class="w-5 h-5" /></button>
                  <button class="text-gray-400 hover:text-red-500 transition-colors"><XCircle class="w-5 h-5" /></button>
                </div>
              </td>
            </tr>

            <!-- Row 3 -->
            <tr class="hover:bg-gray-50/50 transition-colors">
              <td class="px-6 py-4 flex items-center gap-4">
                <div class="w-10 h-14 bg-gray-200 rounded shadow-sm overflow-hidden flex-shrink-0">
                  <img src="https://images.unsplash.com/photo-1629196914167-bd1ec06f7b76?q=80&w=100&auto=format&fit=crop" class="w-full h-full object-cover">
                </div>
                <div>
                  <p class="text-sm font-bold text-[#1f3728]">Kho lưu trữ tĩnh lặng</p>
                  <p class="text-xs text-gray-500 mt-0.5">ISBN: 978-0-12-345678-9</p>
                </div>
              </td>
              <td class="px-6 py-4">
                <p class="text-sm font-medium text-gray-700">Marcus Chen</p>
              </td>
              <td class="px-6 py-4">
                <p class="text-sm text-gray-500">23 tháng 10, 2024</p>
              </td>
              <td class="px-6 py-4">
                <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-100 text-red-600">
                  Khẩn cấp
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex justify-center gap-3">
                  <button class="text-gray-400 hover:text-[#1f3728] transition-colors"><CheckCircle class="w-5 h-5" /></button>
                  <button class="text-gray-400 hover:text-red-500 transition-colors"><XCircle class="w-5 h-5" /></button>
                </div>
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

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

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
</script>
