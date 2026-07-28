<template>
  <div class="bg-[#fbfbfb] min-h-screen">
    <div class="max-w-7xl mx-auto px-6 py-8">
      <!-- Hero Banner -->
      <div class="relative bg-[#1f3728] rounded-3xl overflow-hidden mb-16 p-12 md:p-20 shadow-xl flex items-center">
        <div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
        <div class="absolute inset-0 bg-gradient-to-r from-[#1f3728] via-[#1f3728]/90 to-transparent"></div>
        <div class="relative z-10 max-w-2xl">
          <h1 class="text-4xl md:text-5xl font-bold text-white mb-4 font-title leading-tight">Hướng dẫn quy trình<br/>Mượn & Trả</h1>
          <p class="text-white/80 text-lg leading-relaxed">
            Chào mừng bạn đến với hệ thống thư viện thông minh. Hãy làm theo 4 bước đơn giản dưới đây để bắt đầu hành trình khám phá tri thức của mình.
          </p>
        </div>
      </div>

      <!-- 4 Steps Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
        
        <!-- Step 1 -->
        <div class="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 rounded-full bg-[#1f3728] text-white flex items-center justify-center font-bold text-lg">01</div>
            <h3 class="text-xl font-bold text-[#1f3728]">Tìm sách trực tuyến</h3>
          </div>
          <p class="text-gray-600 mb-6 text-sm leading-relaxed">
            Sử dụng thanh tìm kiếm thông minh tại trang chủ hoặc danh mục để tìm tên sách, tác giả hoặc mã ISBN. Bạn có thể lọc theo thể loại và ngôn ngữ để có kết quả chính xác nhất.
          </p>
          <div class="bg-[#fcf8f3] rounded-xl p-4 mb-6 border border-amber-100 text-sm">
            <div class="flex items-center gap-2 font-bold text-amber-800 mb-1">
              <Lightbulb class="w-4 h-4" /> MẸO TÌM KIẾM
            </div>
            <p class="text-amber-700/80 text-xs">Sử dụng dấu ngoặc kép " " để tìm chính xác tiêu đề sách.</p>
          </div>
          <div class="rounded-xl overflow-hidden h-32 md:h-48 bg-gray-100">
            <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop" class="w-full h-full object-cover" alt="Search Books" />
          </div>
        </div>

        <!-- Step 2 -->
        <div class="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 rounded-full bg-[#1f3728] text-white flex items-center justify-center font-bold text-lg">02</div>
            <h3 class="text-xl font-bold text-[#1f3728]">Đặt mượn & Hẹn giờ</h3>
          </div>
          <p class="text-gray-600 mb-6 text-sm leading-relaxed">
            Sau khi chọn được cuốn sách ưng ý, nhấn nút <strong>"Đặt mượn"</strong>. Hệ thống sẽ giữ sách cho bạn trong vòng 24 giờ. Vui lòng chọn thời gian nhận sách tại quầy thông minh.
          </p>
          <div class="rounded-xl overflow-hidden h-40 md:h-56 bg-gray-100 relative group">
            <img src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=800&auto=format&fit=crop" class="w-full h-full object-cover" alt="Book a time" />
            <div class="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 flex items-center gap-2 shadow-sm font-semibold text-[#1f3728] text-sm">
              <CheckCircle2 class="w-5 h-5 text-green-600" />
              Yêu cầu đã được xác nhận
            </div>
          </div>
        </div>

        <!-- Step 3 -->
        <div class="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 rounded-full bg-[#1f3728] text-white flex items-center justify-center font-bold text-lg">03</div>
            <h3 class="text-xl font-bold text-[#1f3728]">Nhận sách tại Thư viện</h3>
          </div>
          <div class="flex flex-col md:flex-row gap-6">
            <div class="flex-1">
              <p class="text-gray-600 mb-6 text-sm leading-relaxed">
                Đến khu vực <strong>Smart Locker</strong> hoặc quầy hỗ trợ. Quét mã QR nhận được trong ứng dụng để mở ngăn tủ chứa sách của bạn. Quá trình chỉ mất chưa đầy 30 giây.
              </p>
              <div class="space-y-3">
                <div class="flex items-start gap-2 text-sm text-gray-500">
                  <MapPin class="w-4 h-4 mt-0.5" />
                  <span>Tầng 1 - Khu vực A</span>
                </div>
                <div class="flex items-start gap-2 text-sm text-gray-500">
                  <Clock class="w-4 h-4 mt-0.5" />
                  <span>08:00 - 21:00 mỗi ngày</span>
                </div>
              </div>
            </div>
            <div class="w-full md:w-40 h-32 md:h-auto rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
              <img src="https://images.unsplash.com/photo-1621644155106-9c4c79f96b6d?q=80&w=400&auto=format&fit=crop" class="w-full h-full object-cover" alt="Smart Locker" />
            </div>
          </div>
        </div>

        <!-- Step 4 -->
        <div class="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 rounded-full bg-[#1f3728] text-white flex items-center justify-center font-bold text-lg">04</div>
            <h3 class="text-xl font-bold text-[#1f3728]">Trả sách & Đánh giá</h3>
          </div>
          <p class="text-gray-600 mb-6 text-sm leading-relaxed">
            Mang sách đến khe trả sách tự động. Hệ thống sẽ nhận diện chip RFID và hoàn tất quy trình trả sách ngay lập tức. Đừng quên đánh giá cuốn sách để giúp cộng đồng nhé!
          </p>
          <div class="flex gap-4">
            <div class="flex-1 bg-gray-50 rounded-xl p-4 flex flex-col items-center justify-center text-center gap-2">
              <RefreshCw class="w-6 h-6 text-[#1f3728]" />
              <span class="text-xs font-semibold text-gray-600">Trả sách tự động 24/7</span>
            </div>
            <div class="flex-1 bg-gray-50 rounded-xl p-4 flex flex-col items-center justify-center text-center gap-2">
              <Star class="w-6 h-6 text-[#1f3728]" />
              <span class="text-xs font-semibold text-gray-600">Tích lũy điểm uy tín</span>
            </div>
          </div>
        </div>

      </div>

      <!-- FAQ Section -->
      <div class="max-w-3xl mx-auto mb-12">
        <h2 class="text-3xl font-bold text-center text-[#1f3728] mb-10 font-title">Câu hỏi thường gặp</h2>
        
        <div class="space-y-4">
          <!-- FAQ Item 1 -->
          <div class="bg-white border border-gray-100 rounded-2xl p-6 cursor-pointer hover:border-gray-200 transition-colors flex justify-between items-center shadow-sm">
            <h4 class="font-bold text-[#1f3728]">Tôi có thể mượn tối đa bao nhiêu cuốn sách?</h4>
            <ChevronDown class="w-5 h-5 text-gray-400" />
          </div>
          <!-- FAQ Item 2 -->
          <div class="bg-white border border-gray-100 rounded-2xl p-6 cursor-pointer hover:border-gray-200 transition-colors flex justify-between items-center shadow-sm">
            <h4 class="font-bold text-[#1f3728]">Làm sao để gia hạn thời gian mượn?</h4>
            <ChevronDown class="w-5 h-5 text-gray-400" />
          </div>
          <!-- FAQ Item 3 -->
          <div class="bg-white border border-gray-100 rounded-2xl p-6 cursor-pointer hover:border-gray-200 transition-colors flex justify-between items-center shadow-sm">
            <h4 class="font-bold text-[#1f3728]">Tôi bị mất sách hoặc làm hỏng sách thì sao?</h4>
            <ChevronDown class="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { 
  Lightbulb,
  CheckCircle2,
  MapPin,
  Clock,
  RefreshCw,
  Star,
  ChevronDown
} from 'lucide-vue-next'
</script>

<style scoped>
.font-title {
  font-family: 'Inter', sans-serif;
}
</style>
