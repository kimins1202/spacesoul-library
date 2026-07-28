<template>
  <div class="admin-shell flex h-screen bg-gray-50 font-sans overflow-hidden">
    <!-- Sidebar -->
    <aside class="admin-sidebar w-72 bg-[#1f3728] flex flex-col justify-between hidden md:flex text-white flex-shrink-0">
      <div>
        <!-- Logo -->
        <div class="px-6 py-6 border-b border-white/10">
          <div class="flex items-center gap-2.5">
            <div class="admin-brand-mark">
              <img src="/spacesoul_mark_v4_admin.png" alt="Logo Spacesoul Library" />
            </div>
            <div>
              <h1 class="text-[13px] font-extrabold text-white leading-tight uppercase tracking-tight">Spacesoul Library</h1>
              <p class="text-[9px] font-semibold text-[#dfbd75] uppercase tracking-[0.16em]">Administration</p>
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
          <router-link
            to="/admin/profile"
            title="Xem thông tin cá nhân"
            class="admin-account-link min-w-0 flex flex-1 items-center gap-3 rounded-lg"
          >
            <div class="w-8 h-8 rounded-full bg-white/20 border border-white/20 flex items-center justify-center font-bold text-sm text-white flex-shrink-0">
              {{ adminInitial }}
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-sm font-bold text-white truncate">{{ adminName }}</p>
              <p class="text-[10px] text-white/50 font-medium capitalize">{{ isAdmin ? 'Quản trị viên' : 'Nhân viên' }}</p>
            </div>
          </router-link>
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
      <header class="admin-topbar h-[72px] flex items-center justify-between px-8 bg-white border-b border-gray-200 shadow-sm flex-shrink-0">
        <div class="flex items-center gap-3">
          <h2 class="text-base font-bold text-gray-900">{{ currentPageName }}</h2>
          <div class="text-gray-300">·</div>
          <p class="text-sm text-gray-500">{{ currentDate }}</p>
        </div>
        <div class="flex items-center gap-3">
          <!-- Pending badge -->
          <div v-if="pendingCount > 0" class="pending-summary flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg">
            <div class="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></div>
            <span class="text-xs font-bold text-amber-700">{{ pendingCount }} yêu cầu đang chờ</span>
          </div>
          <!-- User info -->
          <router-link
            to="/admin/profile"
            title="Xem thông tin cá nhân"
            class="admin-topbar-account flex items-center gap-2 pl-3 border-l border-gray-200 rounded-r-lg"
          >
            <div class="w-7 h-7 rounded-full bg-[#1f3728] text-white flex items-center justify-center text-xs font-bold">
              {{ adminInitial }}
            </div>
            <div class="hidden sm:block">
              <p class="text-xs font-bold text-gray-800 leading-tight">{{ adminName }}</p>
              <p class="text-[10px] text-gray-400">{{ isAdmin ? 'Admin' : 'Nhân viên' }}</p>
            </div>
          </router-link>
          <button
            type="button"
            class="admin-mobile-logout md:hidden"
            title="Đăng xuất"
            aria-label="Đăng xuất"
            @click="handleLogout"
          >
            <LogOut />
          </button>
        </div>
      </header>

      <!-- Scrollable Content -->
      <div class="admin-content flex-1 overflow-auto p-7 bg-gray-50">
        <router-view v-slot="{ Component }">
          <transition name="page" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>

    <nav class="admin-mobile-nav md:hidden">
      <router-link to="/admin/dashboard" :class="{ active: route.path === '/admin/dashboard' }">
        <LayoutDashboard /><span>Tổng quan</span>
      </router-link>
      <router-link to="/admin/books" :class="{ active: route.path.startsWith('/admin/books') }">
        <Library /><span>Sách</span>
      </router-link>
      <router-link to="/admin/borrows" :class="{ active: route.path.startsWith('/admin/borrows') }">
        <span class="mobile-icon"><ClipboardList /><b v-if="pendingCount > 0">{{ pendingCount }}</b></span>
        <span>Mượn trả</span>
      </router-link>
      <router-link v-if="isAdmin" to="/admin/users" :class="{ active: route.path.startsWith('/admin/users') }">
        <Users /><span>Độc giả</span>
      </router-link>
      <router-link to="/admin/profile" :class="{ active: route.path === '/admin/profile' }">
        <CircleUserRound /><span>Cá nhân</span>
      </router-link>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { LayoutDashboard, Library, Users, ClipboardList, LogOut, CircleUserRound } from 'lucide-vue-next'
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
  'admin-borrows': 'Quản lý mượn trả',
  'admin-profile': 'Thông tin cá nhân'
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

onMounted(() => {
  loadPendingCount()
  window.addEventListener('borrow-status-changed', loadPendingCount)
})

onUnmounted(() => {
  window.removeEventListener('borrow-status-changed', loadPendingCount)
})
</script>

<style scoped>
.font-title { font-family: 'Be Vietnam Pro', sans-serif; }

.admin-shell {
  background: #f3f5f1;
}

.admin-sidebar {
  position: relative;
  background:
    radial-gradient(circle at 15% 0%, rgba(219, 181, 103, 0.18), transparent 19rem),
    linear-gradient(165deg, #17392a 0%, #11291e 62%, #0c2117 100%);
  box-shadow: 14px 0 40px rgba(13, 35, 24, 0.13);
}

.admin-sidebar :deep([class*="text-white/30"]),
.admin-sidebar :deep([class*="text-white/40"]),
.admin-sidebar :deep([class*="text-white/50"]) {
  color: rgba(255,255,255,.62) !important;
}

.admin-sidebar :deep([class*="text-white/70"]) {
  color: rgba(255,255,255,.82) !important;
}

.admin-sidebar nav :deep(a) {
  min-height: 44px;
  border: 1px solid transparent;
}

.admin-sidebar nav :deep(a.bg-white) {
  border-color: rgba(224,189,112,.42);
  background: #f5f1e7 !important;
  color: #173b2b !important;
  box-shadow: 0 9px 24px rgba(0,0,0,.14);
}

.admin-sidebar nav :deep(a:not(.bg-white):hover) {
  border-color: rgba(255,255,255,.09);
  background: rgba(255,255,255,.08);
}

.admin-sidebar::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.08;
  background-image:
    linear-gradient(rgba(255,255,255,.18) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,.18) 1px, transparent 1px);
  background-size: 42px 42px;
  mask-image: linear-gradient(to bottom, black, transparent 70%);
}

.admin-sidebar > * {
  position: relative;
  z-index: 1;
}

.admin-brand-mark {
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
}

.admin-brand-mark img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transform: scale(1.4);
  filter: drop-shadow(0 3px 7px rgba(0, 0, 0, .18));
}

.admin-account-link,
.admin-topbar-account {
  transition: background-color .2s ease, transform .2s ease;
}

.admin-account-link:hover {
  background: rgba(255, 255, 255, .08);
}

.admin-topbar-account {
  padding-top: 5px;
  padding-bottom: 5px;
  padding-right: 7px;
}

.admin-topbar-account:hover {
  background: #eef2ec;
}

.admin-mobile-logout {
  width: 34px;
  height: 34px;
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  border: 1px solid #ead4d0;
  border-radius: 10px;
  background: #fbefed;
  color: #a2443e;
}

.admin-mobile-logout svg {
  width: 16px;
  height: 16px;
}

.admin-mobile-logout:active {
  background: #f4deda;
}

.admin-topbar {
  background: rgba(255, 255, 252, 0.92);
  backdrop-filter: blur(16px);
  border-color: rgba(31,55,40,.08);
  box-shadow: 0 8px 30px rgba(25, 48, 34, .045);
}

.admin-content {
  background:
    radial-gradient(circle at 88% 5%, rgba(206, 173, 104, .09), transparent 24rem),
    #f3f5f1;
}

.admin-content :deep(.bg-white) {
  border-color: rgba(31,55,40,.1);
}

.admin-content :deep(.text-gray-400) {
  color: #7b867e;
}

.admin-content :deep(.text-gray-500) {
  color: #647168;
}

.admin-content :deep(input),
.admin-content :deep(select),
.admin-content :deep(textarea) {
  color: #273d31;
  background-color: #fff;
  border-color: #d7dbd4;
}

.admin-content :deep(thead) {
  color: #42564a;
  background: #f1f4ef;
}

.admin-mobile-nav {
  position: fixed;
  z-index: 80;
  left: 10px;
  right: 10px;
  bottom: 10px;
  min-height: 66px;
  padding: 8px 6px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  border: 1px solid rgba(31,55,40,.11);
  border-radius: 18px;
  background: rgba(255,255,252,.94);
  backdrop-filter: blur(18px);
  box-shadow: 0 18px 48px rgba(18,45,31,.18);
}

.admin-mobile-nav a {
  min-width: 0;
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 7px 8px;
  border-radius: 12px;
  color: #869087;
  font-size: .58rem;
  font-weight: 700;
  white-space: nowrap;
}

.admin-mobile-nav a > svg,
.admin-mobile-nav .mobile-icon > svg {
  width: 19px;
  height: 19px;
}

.admin-mobile-nav a.active {
  color: #1f4d36;
  background: #e9eee8;
}

.mobile-icon {
  position: relative;
}

.mobile-icon b {
  position: absolute;
  top: -7px;
  right: -10px;
  min-width: 15px;
  height: 15px;
  padding: 0 3px;
  display: grid;
  place-items: center;
  border-radius: 99px;
  background: #bf4b49;
  color: white;
  font-size: .5rem;
}

@media (max-width: 767px) {
  .admin-topbar {
    height: 64px;
    padding: 0 18px;
  }

  .admin-topbar p,
  .admin-topbar .text-gray-300 {
    display: none;
  }

  .admin-content {
    padding: 18px 16px 94px;
  }

  .pending-summary {
    padding: 7px;
  }

  .pending-summary span {
    display: none;
  }

  .admin-topbar-account {
    padding-left: 8px;
  }
}

@media (max-width: 420px) {
  .admin-topbar {
    padding: 0 12px;
  }

  .admin-topbar h2 {
    max-width: 155px;
    overflow: hidden;
    font-size: .8rem;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .admin-topbar-account > div:last-child {
    display: none;
  }

  .admin-content {
    padding-right: 10px;
    padding-left: 10px;
  }

  .admin-mobile-nav {
    right: 6px;
    left: 6px;
  }

  .admin-mobile-nav a {
    padding-inline: 4px;
  }
}

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
