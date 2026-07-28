<template>
  <div class="min-h-screen flex flex-col font-sans bg-[#fbfbfb] text-[#1f3728]">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm transition-all duration-300">
      <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <!-- Logo -->
        <div class="flex-1 flex items-center gap-2">
          <router-link to="/" class="auth-brand flex items-center gap-3 group">
            <span class="auth-brand-mark"><img src="/spacesoul_mark_v4_transparent.png" alt="Logo Spacesoul Library" /></span>
            <span class="text-xl md:text-2xl font-extrabold uppercase tracking-tight text-[#1f3728] group-hover:text-green-800 transition-colors">
              SPACESOUL LIBRARY
            </span>
          </router-link>
        </div>

        <!-- Navigation -->
        <nav class="hidden md:flex items-center justify-center gap-8 flex-1">
          <router-link to="/" class="text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-[#1f3728] transition-colors py-2 relative group">
            Trang chủ
            <span class="absolute bottom-0 left-0 w-full h-[2px] bg-[#1f3728] transition-transform duration-300 origin-left scale-x-0 group-hover:scale-x-100"></span>
          </router-link>
          <router-link to="/books" class="text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-[#1f3728] transition-colors py-2 relative group">
            Danh mục
            <span class="absolute bottom-0 left-0 w-full h-[2px] bg-[#1f3728] transition-transform duration-300 origin-left scale-x-0 group-hover:scale-x-100"></span>
          </router-link>
          <router-link to="/guide" class="text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-[#1f3728] transition-colors py-2 relative group">
            Hướng dẫn
            <span class="absolute bottom-0 left-0 w-full h-[2px] bg-[#1f3728] transition-transform duration-300 origin-left scale-x-0 group-hover:scale-x-100"></span>
          </router-link>
          <router-link to="/contact" class="text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-[#1f3728] transition-colors py-2 relative group">
            Liên hệ
            <span class="absolute bottom-0 left-0 w-full h-[2px] bg-[#1f3728] transition-transform duration-300 origin-left scale-x-0 group-hover:scale-x-100"></span>
          </router-link>
        </nav>

        <!-- Right Side -->
        <div class="flex items-center justify-end flex-1">
          <div v-if="route.path === '/register'" class="text-right">
            <span class="text-xs font-semibold text-gray-500 block">Đã có tài khoản?</span>
            <router-link to="/login" class="text-sm font-bold text-[#1f3728] hover:underline">
              Đăng nhập ngay
            </router-link>
          </div>
          <!-- Trên trang login, form đã có nút đăng ký bên trong nên không cần hiển thị trên Header -->
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- Footer -->
    <footer class="bg-[#1b2a20] text-white pt-16 pb-8">
      <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-white/10 pb-12 mb-8">
        <div class="col-span-1 md:col-span-2">
          <h2 class="text-xl font-extrabold uppercase tracking-tighter mb-4">SPACESOUL LIBRARY</h2>
          <p class="text-white/70 text-sm leading-relaxed max-w-sm">
            Hệ thống thư viện hiện đại kết hợp kiến trúc hữu cơ và công nghệ số hóa toàn diện.
          </p>
        </div>
        
        <div>
          <h3 class="font-bold mb-5 uppercase tracking-wider text-sm text-white/70">Liên Kết Nhanh</h3>
          <ul class="space-y-3">
            <li><router-link to="/about" class="text-white hover:text-white/70 transition-colors text-sm font-medium">Về chúng tôi</router-link></li>
            <li><router-link to="/rules" class="text-white hover:text-white/70 transition-colors text-sm font-medium">Hướng dẫn mượn sách</router-link></li>
            <li><router-link to="/faq" class="text-white hover:text-white/70 transition-colors text-sm font-medium">Câu hỏi thường gặp</router-link></li>
            <li><router-link to="/privacy" class="text-white hover:text-white/70 transition-colors text-sm font-medium">Chính sách bảo mật</router-link></li>
          </ul>
        </div>

        <div>
          <h3 class="font-bold mb-5 uppercase tracking-wider text-sm text-white/70">Kết Nối</h3>
          <div class="flex gap-4">
            <a href="#" class="text-white hover:text-white/70 transition-colors text-sm font-medium">Facebook</a>
            <a href="#" class="text-white hover:text-white/70 transition-colors text-sm font-medium">Instagram</a>
            <a href="#" class="text-white hover:text-white/70 transition-colors text-sm font-medium">LinkedIn</a>
          </div>
          <p class="text-white/50 text-[11px] mt-8 font-medium">
            © 2024 Spacesoul Library. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()
</script>

<style scoped>
.auth-brand-mark{width:48px;height:48px;display:grid;place-items:center;flex:0 0 auto}
.auth-brand-mark img{width:100%;height:100%;object-fit:contain;transform:scale(1.32);transition:transform .25s}
.auth-brand:hover .auth-brand-mark img{transform:scale(1.38)}
</style>
