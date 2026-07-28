<template>
  <div>
    <!-- Hero Banner Section -->
    <section class="relative pt-32 pb-24 flex flex-col items-center justify-center min-h-[500px] overflow-hidden mb-8">
      <!-- Background Image -->
      <img src="https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=2000&auto=format&fit=crop" class="absolute inset-0 w-full h-full object-cover" alt="Library Banner" />
      <!-- Gradient Overlay -->
      <div class="absolute inset-0 bg-gradient-to-b from-[#1b2a20]/80 via-[#1b2a20]/60 to-[#fbfbfb]"></div>

      <div class="relative z-10 w-full px-6 flex flex-col items-center text-center">
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold font-title text-white mb-6 tracking-tight drop-shadow-md">
          Khám phá Tri thức Việt
        </h1>
        <p class="text-white/95 max-w-2xl mx-auto mb-10 text-sm md:text-lg font-medium drop-shadow-md">
          Hành trình tìm kiếm cảm hứng bắt đầu từ những trang sách. Khám phá kho tàng tri thức đa dạng từ văn học nghệ thuật đến công nghệ hiện đại.
        </p>

        <!-- Search Bar -->
        <div class="bg-white/95 backdrop-blur-xl border border-white/40 rounded-2xl p-2.5 max-w-4xl w-full mx-4 shadow-2xl flex flex-col md:flex-row gap-2 transition-transform duration-300 hover:scale-[1.01]">
          <div class="flex-1 flex items-center px-4">
            <Search class="w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Tìm tên sách hoặc tác giả..." 
              class="w-full bg-transparent border-none outline-none px-3 py-2.5 text-sm md:text-base text-gray-800 font-medium placeholder:text-gray-400"
            >
          </div>
          <div class="h-px md:h-8 w-full md:w-px bg-gray-200 mx-2 self-center"></div>
          <div class="flex flex-col md:flex-row gap-2">
            <select class="bg-transparent border-none outline-none text-sm font-semibold text-gray-600 px-3 py-2.5 cursor-pointer appearance-none hover:text-[#1b2a20] transition-colors">
              <option>Tất cả thể loại</option>
              <option>Văn học</option>
              <option>Kinh tế</option>
              <option>Khoa học</option>
              <option>Công nghệ</option>
            </select>
            <select class="bg-transparent border-none outline-none text-sm font-semibold text-gray-600 px-3 py-2.5 cursor-pointer appearance-none hover:text-[#1b2a20] transition-colors">
              <option>Trạng thái: Tất cả</option>
              <option>Sẵn có</option>
              <option>Đang mượn</option>
            </select>
            <button class="bg-[#1b2a20] text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-[#121c15] transition-colors flex items-center justify-center gap-2 shadow-md">
              <Filter class="w-4 h-4" /> Lọc kết quả
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Thể loại nổi bật -->
    <section class="max-w-7xl mx-auto px-6 py-12">
      <div class="flex items-center gap-2 mb-8">
        <Sparkles class="w-5 h-5 text-[#1f3728]" />
        <h2 class="text-2xl font-bold font-title text-[#1f3728]">Thể loại nổi bật</h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <!-- Văn học -->
        <div class="relative rounded-2xl overflow-hidden h-72 group cursor-pointer shadow-md">
          <img src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=800&auto=format&fit=crop" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Văn học">
          <div class="absolute inset-0 bg-gradient-to-t from-[#16241c]/90 via-[#1f3728]/40 to-transparent"></div>
          <div class="absolute bottom-0 left-0 p-8">
            <span class="bg-[#e2eadb]/20 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3 inline-block">324 cuốn sách</span>
            <h3 class="text-3xl font-bold font-title text-white mb-2">Văn học</h3>
            <p class="text-white/80 text-sm max-w-sm">Từ những tác phẩm kinh điển đến văn học hiện đại, nơi cảm xúc và ngôn từ hòa quyện.</p>
          </div>
        </div>

        <!-- Khoa học -->
        <div class="relative rounded-2xl overflow-hidden h-72 group cursor-pointer shadow-md">
          <img src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=800&auto=format&fit=crop" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Khoa học">
          <div class="absolute inset-0 bg-gradient-to-t from-[#16241c]/90 via-[#1f3728]/40 to-transparent"></div>
          <div class="absolute bottom-0 left-0 p-8">
            <span class="bg-[#e2eadb]/20 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3 inline-block">156 cuốn sách</span>
            <h3 class="text-3xl font-bold font-title text-white mb-2">Khoa học</h3>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Nghệ thuật -->
        <div class="relative rounded-2xl overflow-hidden h-56 group cursor-pointer shadow-sm">
          <img src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=600&auto=format&fit=crop" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Nghệ thuật">
          <div class="absolute inset-0 bg-gradient-to-t from-[#16241c]/80 to-transparent"></div>
          <div class="absolute bottom-0 left-0 p-6">
            <span class="bg-[#e2eadb]/20 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-2 inline-block">89 cuốn sách</span>
            <h3 class="text-2xl font-bold font-title text-white">Nghệ thuật</h3>
          </div>
        </div>
        
        <!-- Kinh tế -->
        <div class="relative rounded-2xl overflow-hidden h-56 group cursor-pointer shadow-sm">
          <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Kinh tế">
          <div class="absolute inset-0 bg-gradient-to-t from-[#16241c]/80 to-transparent"></div>
          <div class="absolute bottom-0 left-0 p-6">
            <span class="bg-[#e2eadb]/20 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-2 inline-block">212 cuốn sách</span>
            <h3 class="text-2xl font-bold font-title text-white">Kinh tế</h3>
          </div>
        </div>

        <!-- Công nghệ -->
        <div class="relative rounded-2xl overflow-hidden h-56 group cursor-pointer shadow-sm">
          <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Công nghệ">
          <div class="absolute inset-0 bg-gradient-to-t from-[#16241c]/80 to-transparent"></div>
          <div class="absolute bottom-0 left-0 p-6">
            <span class="bg-[#e2eadb]/20 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-2 inline-block">198 cuốn sách</span>
            <h3 class="text-2xl font-bold font-title text-white">Công nghệ</h3>
          </div>
        </div>
      </div>
    </section>

    <!-- Sách mới cập nhật -->
    <section class="max-w-7xl mx-auto px-6 py-12">
      <div class="flex justify-between items-end mb-8 border-b border-gray-100 pb-4">
        <div>
          <h2 class="text-2xl font-bold font-title text-[#1f3728]">Sách mới cập nhật</h2>
          <p class="text-gray-500 text-sm mt-1">Những đầu sách vừa được bổ sung vào thư viện tuần này.</p>
        </div>
        <a href="#" class="text-sm font-bold text-[#1f3728] hover:underline flex items-center gap-1">Xem tất cả <ChevronRight class="w-4 h-4" /></a>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-5 gap-6">
        <!-- Card 1 -->
        <div class="group cursor-pointer">
          <div class="relative rounded-lg overflow-hidden shadow-sm mb-3 bg-gray-100 aspect-[3/4]">
            <img src="https://images.unsplash.com/photo-1629196914167-bd1ec06f7b76?q=80&w=300&auto=format&fit=crop" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
            <div class="absolute top-2 right-2 bg-[#1f3728] text-white text-[10px] font-bold uppercase px-2 py-1 rounded shadow-sm">Sẵn có</div>
          </div>
          <h3 class="font-bold text-sm text-[#1f3728] truncate">Hành trình vạn dặm</h3>
          <p class="text-xs text-gray-500 mt-0.5 truncate">Nguyễn Văn A</p>
        </div>

        <!-- Card 2 -->
        <div class="group cursor-pointer">
          <div class="relative rounded-lg overflow-hidden shadow-sm mb-3 bg-gray-100 aspect-[3/4]">
            <img src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=300&auto=format&fit=crop" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
            <div class="absolute top-2 right-2 bg-gray-500/80 backdrop-blur text-white text-[10px] font-bold uppercase px-2 py-1 rounded shadow-sm">Đang mượn</div>
          </div>
          <h3 class="font-bold text-sm text-[#1f3728] truncate">Kiến trúc Đương đại</h3>
          <p class="text-xs text-gray-500 mt-0.5 truncate">Trần Thị B</p>
        </div>

        <!-- Card 3 -->
        <div class="group cursor-pointer">
          <div class="relative rounded-lg overflow-hidden shadow-sm mb-3 bg-gray-100 aspect-[3/4]">
            <img src="https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=300&auto=format&fit=crop" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
            <div class="absolute top-2 right-2 bg-[#1f3728] text-white text-[10px] font-bold uppercase px-2 py-1 rounded shadow-sm">Sẵn có</div>
          </div>
          <h3 class="font-bold text-sm text-[#1f3728] truncate">Thế giới Phẳng</h3>
          <p class="text-xs text-gray-500 mt-0.5 truncate">Thomas Friedman</p>
        </div>

        <!-- Card 4 -->
        <div class="group cursor-pointer">
          <div class="relative rounded-lg overflow-hidden shadow-sm mb-3 bg-gray-100 aspect-[3/4]">
            <img src="https://images.unsplash.com/photo-1474932430478-367d16b99031?q=80&w=300&auto=format&fit=crop" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
            <div class="absolute top-2 right-2 bg-[#1f3728] text-white text-[10px] font-bold uppercase px-2 py-1 rounded shadow-sm">Sẵn có</div>
          </div>
          <h3 class="font-bold text-sm text-[#1f3728] truncate">Tâm lý học Hành vi</h3>
          <p class="text-xs text-gray-500 mt-0.5 truncate">Lê Hoàng C</p>
        </div>

        <!-- Card 5 -->
        <div class="group cursor-pointer">
          <div class="relative rounded-lg overflow-hidden shadow-sm mb-3 bg-gray-100 aspect-[3/4]">
            <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=300&auto=format&fit=crop" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
            <div class="absolute top-2 right-2 bg-[#1f3728] text-white text-[10px] font-bold uppercase px-2 py-1 rounded shadow-sm">Sẵn có</div>
          </div>
          <h3 class="font-bold text-sm text-[#1f3728] truncate">AI và Tương lai</h3>
          <p class="text-xs text-gray-500 mt-0.5 truncate">Phạm Minh D</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { Search, Filter, Sparkles, ChevronRight } from 'lucide-vue-next'
</script>
