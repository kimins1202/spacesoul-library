<template>
  <div class="contact-page bg-[#fbfbfb] min-h-screen">
    
    <!-- Hero Banner -->
    <div class="contact-hero bg-[#efebd8] pt-20 pb-16 relative overflow-hidden">
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
      <div class="grid grid-cols-1 gap-8">
        <!-- Contact Info -->
        <div class="contact-info-grid grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Location -->
          <div class="contact-info-card location-card bg-white rounded-3xl p-6 border-l-4 border-[#1f3728] shadow-sm">
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
          <div class="contact-info-card bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
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
      <div class="contact-map mt-8 rounded-3xl overflow-hidden shadow-lg border border-gray-100 relative h-[400px]">
        <img src="/contact-location.png" class="w-full h-full object-cover" alt="Không gian đô thị tại vị trí thư viện Spacesoul" />
        <div class="absolute inset-0 bg-[#1f3728]/10 mix-blend-multiply"></div>
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
  MapPin,
  Phone,
  AtSign,
  Clock
} from 'lucide-vue-next'
</script>

<style scoped>
.font-title {
  font-family: 'Be Vietnam Pro', sans-serif;
}

.contact-page { background:#f4f5f1; color:#183d2b; }
.contact-hero {
  color:#fff;
  background:
    radial-gradient(circle at 82% 0%,rgba(220,186,110,.2),transparent 24rem),
    linear-gradient(135deg,#153927,#254f38);
  border-bottom:1px solid #cfb574;
}
.contact-hero>div:first-child { opacity:.12!important; filter:invert(1); }
.contact-hero>div:nth-child(2) { background:linear-gradient(to top,rgba(11,34,23,.3),transparent); }
.contact-hero h1 { color:#fff; text-shadow:0 2px 16px rgba(0,0,0,.18); }
.contact-hero p { color:rgba(255,255,255,.75); }
.contact-info-card {
  border-color:#d8dfd8;
  box-shadow:0 5px 16px rgba(24,55,38,.055);
}
.contact-info-card { min-height:190px; }
.location-card { border-left-color:#c39a45!important; }
.contact-info-card :deep(.bg-green-100),.contact-info-card :deep(.bg-gray-100) { background:#e7ede7!important; color:#1f5037!important; }
.contact-info-card :deep(.text-gray-600) { color:#526359!important; }
.contact-info-card :deep(.text-gray-400) { color:#6f7f75!important; }
.contact-map { border-color:#b8c4ba; box-shadow:0 7px 20px rgba(24,55,38,.09); }

@media (max-width: 640px) {
  .contact-hero {
    padding-top: 52px;
    padding-bottom: 56px;
  }

  .contact-hero h1 {
    font-size: 2rem;
  }

  .contact-info-card {
    min-height: 0;
    padding: 20px;
  }

  .contact-map {
    height: 280px;
    border-radius: 18px;
  }

  .contact-map > div:last-child {
    right: 14px;
    bottom: 14px;
    left: 14px;
  }
}
</style>
