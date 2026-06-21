<template>
  <div class="min-h-screen flex flex-col font-sans bg-[#fbfbfb] text-[#1f3728]">
    <!-- Header / Navbar -->
    <header class="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <!-- Logo -->
        <div class="flex-1">
          <router-link to="/" class="text-2xl font-extrabold uppercase tracking-tighter text-[#1f3728]">
            SPACESOUL LIBRARY
          </router-link>
        </div>

        <!-- Navigation -->
        <nav class="hidden md:flex items-center justify-center gap-8 flex-1">
          <router-link 
            to="/" 
            class="text-xs font-bold uppercase tracking-wider transition-colors relative py-2"
            :class="route.path === '/' ? 'text-[#1f3728]' : 'text-gray-500 hover:text-[#1f3728]'"
          >
            Trang chủ
            <span v-if="route.path === '/'" class="absolute bottom-0 left-0 w-full h-[2px] bg-[#1f3728]"></span>
          </router-link>
          
          <router-link 
            to="/books" 
            class="text-xs font-bold uppercase tracking-wider transition-colors relative py-2"
            :class="route.path.startsWith('/books') ? 'text-[#1f3728]' : 'text-gray-500 hover:text-[#1f3728]'"
          >
            Danh mục
            <span v-if="route.path.startsWith('/books')" class="absolute bottom-0 left-0 w-full h-[2px] bg-[#1f3728]"></span>
          </router-link>
          
          <router-link 
            to="/guide" 
            class="text-xs font-bold uppercase tracking-wider transition-colors relative py-2"
            :class="route.path.startsWith('/guide') ? 'text-[#1f3728]' : 'text-gray-500 hover:text-[#1f3728]'"
          >
            Hướng dẫn
            <span v-if="route.path.startsWith('/guide')" class="absolute bottom-0 left-0 w-full h-[2px] bg-[#1f3728]"></span>
          </router-link>
          
          <router-link 
            to="/contact" 
            class="text-xs font-bold uppercase tracking-wider transition-colors relative py-2"
            :class="route.path.startsWith('/contact') ? 'text-[#1f3728]' : 'text-gray-500 hover:text-[#1f3728]'"
          >
            Liên hệ
            <span v-if="route.path.startsWith('/contact')" class="absolute bottom-0 left-0 w-full h-[2px] bg-[#1f3728]"></span>
          </router-link>
          
          <router-link 
            v-if="isAdmin"
            to="/admin" 
            class="text-xs font-bold uppercase tracking-wider transition-colors relative py-2"
            :class="route.path.startsWith('/admin') ? 'text-[#1f3728]' : 'text-gray-500 hover:text-[#1f3728]'"
          >
            Quản lý
            <span v-if="route.path.startsWith('/admin')" class="absolute bottom-0 left-0 w-full h-[2px] bg-[#1f3728]"></span>
          </router-link>
        </nav>

        <!-- Right Side -->
        <div class="flex items-center justify-end gap-5 flex-1">
          <button class="text-[#1f3728] hover:text-gray-500 transition-colors">
            <Bell class="w-[18px] h-[18px]" />
          </button>
          
          <div v-if="isLoggedIn" class="relative group cursor-pointer">
            <button class="text-[#1f3728] hover:text-gray-500 transition-colors flex items-center">
              <UserCircle class="w-5 h-5" v-if="!currentUser?.avatar" />
              <img v-else :src="currentUser.avatar" class="w-6 h-6 rounded-full object-cover" />
            </button>
            <!-- Dropdown -->
            <div class="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              <div class="p-4 border-b border-gray-50">
                <p class="text-sm font-bold truncate">{{ currentUser?.name || 'User' }}</p>
                <p class="text-xs text-gray-500 truncate">{{ currentUser?.email }}</p>
              </div>
              <div class="p-2">
                <router-link to="/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">Hồ sơ</router-link>
                <router-link to="/borrowed" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">Sách đã mượn</router-link>
                <button @click="handleLogout" class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded">Đăng xuất</button>
              </div>
            </div>
          </div>
          
          <div v-else>
            <router-link to="/login" class="text-[#1f3728] hover:text-gray-500 transition-colors flex items-center">
              <UserCircle class="w-5 h-5" />
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1">
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="bg-[#1b2a20] text-white pt-16 pb-8">
      <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-white/10 pb-12 mb-8">
        <div class="col-span-1 md:col-span-2">
          <h2 class="text-xl font-extrabold uppercase tracking-tighter mb-4">SPACESOUL</h2>
          <p class="text-white/70 text-sm leading-relaxed max-w-sm">
            Không gian thư viện số hiện đại, mang tri thức đến gần hơn với cộng đồng thông qua trải nghiệm nghệ thuật và tinh tế.
          </p>
          <div class="flex gap-4 mt-6">
            <a href="#" class="text-white/70 hover:text-white transition-colors text-sm font-medium">Facebook</a>
            <a href="#" class="text-white/70 hover:text-white transition-colors text-sm font-medium">Instagram</a>
            <a href="#" class="text-white/70 hover:text-white transition-colors text-sm font-medium">LinkedIn</a>
          </div>
        </div>
        
        <div>
          <h3 class="font-bold mb-5 uppercase tracking-wider text-sm">Liên Kết</h3>
          <ul class="space-y-3">
            <li><router-link to="/about" class="text-white/70 hover:text-white transition-colors text-sm">Về chúng tôi</router-link></li>
            <li><router-link to="/rules" class="text-white/70 hover:text-white transition-colors text-sm">Quy định mượn trả</router-link></li>
            <li><router-link to="/news" class="text-white/70 hover:text-white transition-colors text-sm">Tin tức thư viện</router-link></li>
            <li><router-link to="/support" class="text-white/70 hover:text-white transition-colors text-sm">Hỗ trợ</router-link></li>
          </ul>
        </div>
        
        <div>
          <h3 class="font-bold mb-5 uppercase tracking-wider text-sm">Địa Chỉ</h3>
          <ul class="space-y-3">
            <li class="text-white/70 text-sm leading-relaxed">
              Tầng 10, Tòa nhà Spacesoul<br>
              Quận 1, Thành phố Hồ Chí Minh
            </li>
            <li class="text-white/70 text-sm mt-4">
              Hotline: 1900 1234<br>
              Email: contact@spacesoul.vn
            </li>
          </ul>
        </div>
      </div>
      
      <div class="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-xs text-white/50">
        <p>© 2024 Spacesoul Library. All rights reserved.</p>
        <div class="flex gap-6 mt-4 md:mt-0">
          <a href="#" class="hover:text-white transition-colors">Chính sách bảo mật</a>
          <a href="#" class="hover:text-white transition-colors">Điều khoản dịch vụ</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Bell, UserCircle } from 'lucide-vue-next'
import { authService } from '@/services/auth'

const route = useRoute()
const router = useRouter()

const isLoggedIn = computed(() => authService.isAuthenticated())
const currentUser = computed(() => authService.getCurrentUser())
const isAdmin = computed(() => ['admin', 'librarian'].includes(currentUser.value?.role))

const handleLogout = () => {
  authService.logout()
  router.push('/login')
}
</script>
