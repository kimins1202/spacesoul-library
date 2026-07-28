<template>
  <div class="bg-[#fbfbfb] min-h-screen">
    
    <!-- Hero Banner -->
    <div class="bg-[#efebd8] pt-20 pb-16 relative overflow-hidden">
      <!-- Decorative background pattern -->
      <div class="absolute inset-0 opacity-10 pointer-events-none" style="background-image: repeating-linear-gradient(90deg, #1f3728 0px, #1f3728 1px, transparent 1px, transparent 40px);"></div>
      <div class="absolute inset-0 bg-gradient-to-t from-[#efebd8] to-transparent"></div>
      
      <div class="max-w-4xl mx-auto px-6 text-center relative z-10">
        <h1 class="text-4xl md:text-5xl font-bold text-[#1f3728] font-title mb-4">Liên Hệ Với Chúng Tôi</h1>
        <p class="text-gray-600 text-sm md:text-base max-w-xl mx-auto">Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy gửi tin nhắn cho chúng tôi nếu bạn có bất kỳ câu hỏi nào về dịch vụ của thư viện.</p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-6 py-12 -mt-10 relative z-20">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Left: Contact Form -->
        <div class="lg:col-span-2 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <div class="flex items-center gap-2 mb-8 text-[#1f3728]">
            <Mail class="w-5 h-5" />
            <h2 class="text-xl font-bold">Gửi tin nhắn trực tuyến</h2>
          </div>

          <form class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-xs font-bold text-gray-700 mb-2">Họ và tên</label>
                <input type="text" placeholder="Nguyễn Văn A" class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-[#1f3728] focus:ring-1 focus:ring-[#1f3728] transition-all text-sm" />
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-700 mb-2">Email</label>
                <input type="email" placeholder="example@gmail.com" class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-[#1f3728] focus:ring-1 focus:ring-[#1f3728] transition-all text-sm" />
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-gray-700 mb-2">Tiêu đề</label>
              <input type="text" placeholder="Bạn cần hỗ trợ về vấn đề gì?" class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-[#1f3728] focus:ring-1 focus:ring-[#1f3728] transition-all text-sm" />
            </div>

            <div>
              <label class="block text-xs font-bold text-gray-700 mb-2">Nội dung</label>
              <textarea rows="5" placeholder="Viết tin nhắn của bạn tại đây..." class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-[#1f3728] focus:ring-1 focus:ring-[#1f3728] transition-all text-sm resize-none"></textarea>
            </div>

            <button type="button" class="bg-[#16241c] hover:bg-[#1f3728] text-white px-8 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors shadow-md">
              Gửi yêu cầu <Send class="w-4 h-4" />
            </button>
          </form>
        </div>

        <!-- Right: Contact Info -->
        <div class="lg:col-span-1 space-y-6">
          <!-- Location -->
          <div class="bg-white rounded-3xl p-6 border-l-4 border-[#1f3728] shadow-sm">
            <div class="flex gap-4">
              <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-[#1f3728] flex-shrink-0">
                <MapPin class="w-6 h-6" />
              </div>
              <div>
                <h3 class="font-bold text-[#1f3728] mb-1">Địa chỉ</h3>
                <p class="text-sm text-gray-600 leading-relaxed">88 Đường Số 7, Khu Đô Thị An Phú,<br/>Thành phố Thủ Đức, TP. Hồ Chí Minh</p>
              </div>
            </div>
          </div>

          <!-- Other Details -->
          <div class="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <h3 class="font-bold text-[#1f3728] mb-6">Thông tin chi tiết</h3>
            
            <div class="space-y-6">
              <div class="flex gap-4 items-center">
                <div class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 flex-shrink-0">
                  <Phone class="w-4 h-4" />
                </div>
                <div>
                  <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Điện thoại</p>
                  <p class="text-sm font-bold text-[#1f3728]">+84 28 1234 5678</p>
                </div>
              </div>

              <div class="flex gap-4 items-center">
                <div class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 flex-shrink-0">
                  <AtSign class="w-4 h-4" />
                </div>
                <div>
                  <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Email</p>
                  <p class="text-sm font-bold text-[#1f3728]">contact@spacesoul.vn</p>
                </div>
              </div>

              <div class="flex gap-4 items-start">
                <div class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 flex-shrink-0 mt-1">
                  <Clock class="w-4 h-4" />
                </div>
                <div>
                  <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Giờ làm việc</p>
                  <p class="text-sm font-bold text-[#1f3728] leading-relaxed">Thứ 2 - Thứ 7: 08:00 - 20:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Map Banner -->
      <div class="mt-8 rounded-3xl overflow-hidden shadow-lg border border-gray-100 relative h-[400px]">
        <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2000&auto=format&fit=crop" class="w-full h-full object-cover" alt="Map" />
        <div class="absolute inset-0 bg-[#1f3728]/20 mix-blend-multiply"></div>
        <div class="absolute bottom-6 left-6">
          <div class="bg-white/90 backdrop-blur-md px-4 py-2 rounded-lg shadow-md flex items-center gap-2 text-sm font-bold text-[#1f3728]">
            <MapPin class="w-4 h-4" /> Vị trí của chúng tôi
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { 
  Mail,
  MapPin,
  Phone,
  AtSign,
  Clock,
  Send
} from 'lucide-vue-next'
</script>

<style scoped>
.font-title {
  font-family: 'Inter', sans-serif;
}
</style>
