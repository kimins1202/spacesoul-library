<template>
  <div class="flex h-screen bg-[#f8fafc] font-sans">
    <!-- Sidebar -->
    <aside class="w-64 bg-[#f4f7f5] border-r border-[#1f3728]/10 flex flex-col justify-between hidden md:flex">
      <div>
        <!-- Logo -->
        <div class="p-6">
          <h1 class="text-2xl font-bold text-[#1f3728] leading-tight">Spacesoul<br>Admin</h1>
          <p class="text-xs font-semibold text-[#1f3728]/60 mt-1 uppercase tracking-wider">Quản lý thư viện</p>
        </div>

        <!-- Navigation -->
        <nav class="mt-4 px-4 space-y-2">
          <router-link to="/admin/dashboard" 
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all"
            active-class="bg-[#e2eadb] text-[#1f3728]"
            exact-active-class="bg-[#e2eadb] text-[#1f3728]"
            :class="[route.path === '/admin/dashboard' ? 'bg-[#e2eadb] text-[#1f3728]' : 'text-[#1f3728]/70 hover:bg-[#1f3728]/5 hover:text-[#1f3728]']">
            <LayoutDashboard class="w-5 h-5" />
            Bảng điều khiển
          </router-link>

          <router-link to="/admin/books" 
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all text-[#1f3728]/70 hover:bg-[#1f3728]/5 hover:text-[#1f3728]">
            <BookOpen class="w-5 h-5" />
            Quản lý sách
          </router-link>

          <router-link to="/admin/users" 
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all text-[#1f3728]/70 hover:bg-[#1f3728]/5 hover:text-[#1f3728]">
            <Users class="w-5 h-5" />
            Quản lý người dùng
          </router-link>

          <router-link to="/admin/borrows" 
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all text-[#1f3728]/70 hover:bg-[#1f3728]/5 hover:text-[#1f3728]">
            <ClipboardList class="w-5 h-5" />
            Yêu cầu mượn
          </router-link>
        </nav>
      </div>

      <!-- Bottom Menu -->
      <div class="p-4 space-y-2 mb-4">
        <button class="flex w-full items-center gap-3 px-4 py-2 text-sm font-semibold text-[#1f3728]/70 hover:text-[#1f3728]">
          <Settings class="w-5 h-5" />
          Cài đặt
        </button>
        <button @click="handleLogout" class="flex w-full items-center gap-3 px-4 py-2 text-sm font-semibold text-[#1f3728]/70 hover:text-[#1f3728]">
          <LogOut class="w-5 h-5" />
          Đăng xuất
        </button>

        <div class="mt-4 pt-4 border-t border-[#1f3728]/10 flex items-center gap-3 px-4">
          <div class="w-10 h-10 rounded-full overflow-hidden bg-[#1f3728]">
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop" alt="Admin" class="w-full h-full object-cover">
          </div>
          <div>
            <p class="text-sm font-bold text-[#1f3728]">{{ adminName }}</p>
            <p class="text-xs text-[#1f3728]/60 font-medium">Thủ thư trưởng</p>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col overflow-hidden">
      <!-- Admin Header -->
      <header class="h-20 flex items-center justify-between px-8 bg-[#f8fafc]">
        <h2 class="text-2xl font-bold text-[#1f3728] font-title">{{ currentPageName }}</h2>
        
        <div class="flex items-center gap-4">
          <div class="relative">
            <Search class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Tìm kiếm sách..." class="pl-9 pr-4 py-2 bg-gray-100 border-none rounded-md text-sm w-64 focus:ring-2 focus:ring-[#1f3728]/20 outline-none">
          </div>
          <button class="bg-[#16241c] text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-[#1f3728] transition-colors">
            Thêm sách mới
          </button>
        </div>
      </header>

      <!-- Scrollable Content -->
      <div class="flex-1 overflow-auto p-8">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { LayoutDashboard, BookOpen, Users, ClipboardList, Settings, LogOut, Search } from 'lucide-vue-next'
import { authService } from '@/services/auth'

const route = useRoute()
const router = useRouter()

const admin = authService.getCurrentUser()
const adminName = admin ? admin.name : 'Alex Rivera'

const routeNames = {
  'admin-dashboard': 'Thống kê tổng quan',
  'admin-books': 'Quản lý sách',
  'admin-users': 'Quản lý người dùng',
  'admin-borrows': 'Quản lý mượn trả'
}

const currentPageName = computed(() => {
  return routeNames[route.name] || 'Quản trị'
})

const handleLogout = () => {
  authService.logout()
  router.push('/login')
}
</script>

<style scoped>
/* Scoped styles nếu cần, nhưng hiện tại đã sử dụng TailwindCSS */
</style>
