<template>
  <div class="flex h-screen bg-gray-50 font-sans overflow-hidden">
    <!-- Sidebar -->
    <aside class="w-64 bg-[#1f3728] flex flex-col justify-between hidden md:flex text-white flex-shrink-0">
      <div>
        <!-- Logo -->
        <div class="px-6 py-5 border-b border-white/10">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <BookOpen class="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 class="text-sm font-extrabold text-white leading-tight uppercase tracking-tight">Spacesoul</h1>
              <p class="text-[10px] font-semibold text-white/50 uppercase tracking-wider">Admin Panel</p>
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="mt-3 px-3 space-y-0.5">
          <p class="text-[9px] font-bold text-white/30 uppercase tracking-widest px-3 pt-3 pb-1.5">Tổng quan</p>
          
          <router-link to="/admin/dashboard"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all"
            :class="route.path === '/admin/dashboard'
              ? 'bg-white text-[#1f3728] shadow-sm'
              : 'text-white/70 hover:bg-white/10 hover:text-white'">
            <LayoutDashboard class="w-4 h-4 flex-shrink-0" />
            Bảng điều khiển
          </router-link>

          <p class="text-[9px] font-bold text-white/30 uppercase tracking-widest px-3 pt-4 pb-1.5">Quản lý</p>

          <router-link to="/admin/books"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all"
            :class="route.path.startsWith('/admin/books')
              ? 'bg-white text-[#1f3728] shadow-sm'
              : 'text-white/70 hover:bg-white/10 hover:text-white'">
            <Library class="w-4 h-4 flex-shrink-0" />
            Quản lý sách
          </router-link>

          <router-link to="/admin/borrows"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all"
            :class="route.path.startsWith('/admin/borrows')
              ? 'bg-white text-[#1f3728] shadow-sm'
              : 'text-white/70 hover:bg-white/10 hover:text-white'">
            <ClipboardList class="w-4 h-4 flex-shrink-0" />
            Yêu cầu mượn
            <span v-if="pendingCount > 0"
              class="ml-auto bg-red-500 text-white text-[9px] font-bold min-w-[18px] h-4 rounded-full flex items-center justify-center px-1">
              {{ pendingCount }}
            </span>
          </router-link>

          <!-- Chỉ Admin mới thấy -->
          <router-link v-if="isAdmin" to="/admin/users"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all"
            :class="route.path.startsWith('/admin/users')
              ? 'bg-white text-[#1f3728] shadow-sm'
              : 'text-white/70 hover:bg-white/10 hover:text-white'">
            <Users class="w-4 h-4 flex-shrink-0" />
            Người dùng
          </router-link>
        </nav>
      </div>

      <!-- Bottom: User info & Logout -->
      <div class="p-3 border-t border-white/10">
        <div class="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/8">
          <div class="w-8 h-8 rounded-full bg-white/20 border border-white/20 flex items-center justify-center font-bold text-sm text-white flex-shrink-0">
            {{ adminInitial }}
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-sm font-bold text-white truncate">{{ adminName }}</p>
            <p class="text-[10px] text-white/50 font-medium capitalize">{{ isAdmin ? 'Quản trị viên' : 'Nhân viên' }}</p>
          </div>
          <button @click="handleLogout" title="Đăng xuất"
            class="p-1.5 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-all flex-shrink-0">
            <LogOut class="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col overflow-hidden">
      <!-- Top Header -->
      <header class="h-14 flex items-center justify-between px-8 bg-white border-b border-gray-200 shadow-sm flex-shrink-0">
        <div class="flex items-center gap-3">
          <h2 class="text-base font-bold text-gray-900">{{ currentPageName }}</h2>
          <div class="text-gray-300">·</div>
          <p class="text-sm text-gray-500">{{ currentDate }}</p>
        </div>
        <div class="flex items-center gap-3">
          <!-- Pending badge -->
          <div v-if="pendingCount > 0" class="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg">
            <div class="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></div>
            <span class="text-xs font-bold text-amber-700">{{ pendingCount }} yêu cầu đang chờ</span>
          </div>
          <!-- User info -->
          <div class="flex items-center gap-2 pl-3 border-l border-gray-200">
            <div class="w-7 h-7 rounded-full bg-[#1f3728] text-white flex items-center justify-center text-xs font-bold">
              {{ adminInitial }}
            </div>
            <div class="hidden sm:block">
              <p class="text-xs font-bold text-gray-800 leading-tight">{{ adminName }}</p>
              <p class="text-[10px] text-gray-400">{{ isAdmin ? 'Admin' : 'Nhân viên' }}</p>
            </div>
          </div>
        </div>
      </header>

      <!-- Scrollable Content -->
      <div class="flex-1 overflow-auto p-6 bg-gray-50">
        <router-view v-slot="{ Component }">
          <transition name="page" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { LayoutDashboard, Library, Users, ClipboardList, LogOut, BookOpen } from 'lucide-vue-next'
import { authService } from '@/services/auth'
import { borrowService } from '@/services/borrow'

const route = useRoute()
const router = useRouter()

const currentUser = authService.getCurrentUser()
const adminName = currentUser ? `${currentUser.lastName || ''} ${currentUser.firstName || ''}`.trim() : 'Admin'
const adminInitial = currentUser?.firstName?.charAt(0)?.toUpperCase() || '?'
const isAdmin = currentUser && currentUser.role === 'admin'

const pendingCount = ref(0)

const routeNames = {
  'admin-dashboard': 'Thống kê tổng quan',
  'admin-books': 'Quản lý sách',
  'admin-users': 'Quản lý người dùng',
  'admin-borrows': 'Quản lý mượn trả'
}

const currentPageName = computed(() => routeNames[route.name] || 'Quản trị')

const currentDate = computed(() => {
  return new Date().toLocaleDateString('vi-VN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })
})

const handleLogout = () => {
  authService.logout()
  router.push('/login')
}

// Load pending borrow count for badge
const loadPendingCount = async () => {
  try {
    const borrows = await borrowService.getAllBorrows()
    pendingCount.value = Array.isArray(borrows)
      ? borrows.filter(b => b.status === 'pending').length
      : 0
  } catch {
    pendingCount.value = 0
  }
}

onMounted(loadPendingCount)
</script>

<style scoped>
.font-title { font-family: 'Inter', sans-serif; }

.page-enter-active,
.page-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
