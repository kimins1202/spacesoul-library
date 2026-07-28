<template>
  <div class="min-h-screen flex flex-col font-sans bg-[#fbfbfb] text-[#1f3728]">
    <!-- Header / Navbar -->
    <header class="sticky top-0 z-50 bg-white/98 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">
      <div class="max-w-7xl mx-auto px-6 h-[68px] flex items-center justify-between gap-4">
        <!-- Logo -->
        <div class="flex items-center gap-2 flex-shrink-0">
          <router-link to="/" class="flex items-center gap-2 group">
            <img src="/spacesoul_logo.png" alt="Logo" class="w-7 h-7 group-hover:scale-110 transition-transform duration-300 rounded-full" />
            <span class="text-lg font-extrabold uppercase tracking-tighter text-[#1f3728] group-hover:text-green-800 transition-colors">
              SPACESOUL
            </span>
          </router-link>
        </div>

        <!-- Navigation -->
        <nav class="hidden md:flex items-center gap-6">
          <router-link to="/" class="text-[11px] font-bold uppercase tracking-wider transition-colors relative py-1 group"
            :class="route.path === '/' ? 'text-[#1f3728]' : 'text-gray-500 hover:text-[#1f3728]'">
            Trang chủ
            <span class="absolute -bottom-0.5 left-0 w-full h-[2px] bg-[#1f3728] transition-transform duration-300 origin-left"
              :class="route.path === '/' ? 'scale-x-100' : 'scale-x-0'"></span>
          </router-link>
          <router-link to="/books" class="text-[11px] font-bold uppercase tracking-wider transition-colors relative py-1 group"
            :class="route.path.startsWith('/books') ? 'text-[#1f3728]' : 'text-gray-500 hover:text-[#1f3728]'">
            Danh mục
            <span class="absolute -bottom-0.5 left-0 w-full h-[2px] bg-[#1f3728] transition-transform duration-300 origin-left"
              :class="route.path.startsWith('/books') ? 'scale-x-100' : 'scale-x-0'"></span>
          </router-link>
          <router-link to="/guide" class="text-[11px] font-bold uppercase tracking-wider transition-colors relative py-1 group"
            :class="route.path.startsWith('/guide') ? 'text-[#1f3728]' : 'text-gray-500 hover:text-[#1f3728]'">
            Hướng dẫn
            <span class="absolute -bottom-0.5 left-0 w-full h-[2px] bg-[#1f3728] transition-transform duration-300 origin-left"
              :class="route.path.startsWith('/guide') ? 'scale-x-100' : 'scale-x-0'"></span>
          </router-link>
          <router-link to="/contact" class="text-[11px] font-bold uppercase tracking-wider transition-colors relative py-1 group"
            :class="route.path.startsWith('/contact') ? 'text-[#1f3728]' : 'text-gray-500 hover:text-[#1f3728]'">
            Liên hệ
            <span class="absolute -bottom-0.5 left-0 w-full h-[2px] bg-[#1f3728] transition-transform duration-300 origin-left"
              :class="route.path.startsWith('/contact') ? 'scale-x-100' : 'scale-x-0'"></span>
          </router-link>
          <router-link v-if="isEmployee" to="/admin/dashboard"
            class="text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg bg-[#1f3728] text-white hover:bg-[#16241c] transition-colors">
            Quản lý
          </router-link>
        </nav>

        <!-- Right Side Actions -->
        <div class="flex items-center gap-2 flex-shrink-0">
          <!-- Cart Button -->
          <div class="relative" v-if="isLoggedIn && !isEmployee">
            <button @click="toggleCart"
              class="relative p-2 rounded-xl text-gray-600 hover:text-[#1f3728] hover:bg-gray-100 transition-all">
              <ShoppingBag class="w-5 h-5" />
              <span v-if="cartCount > 0"
                class="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-sm">
                {{ cartCount }}
              </span>
            </button>
          </div>

          <!-- Notification Button -->
          <div class="relative" v-if="isLoggedIn">
            <button @click="toggleNotification"
              class="relative p-2 rounded-xl text-gray-600 hover:text-[#1f3728] hover:bg-gray-100 transition-all">
              <Bell class="w-5 h-5" />
              <span v-if="unreadCount > 0"
                class="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-sm animate-pulse">
                {{ unreadCount }}
              </span>
            </button>
          </div>

          <!-- User Dropdown -->
          <div v-if="isLoggedIn" class="relative group cursor-pointer">
            <button class="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-100 transition-all">
              <div class="w-7 h-7 rounded-full bg-[#1f3728] text-white flex items-center justify-center text-xs font-bold">
                {{ userInitial }}
              </div>
              <span class="hidden sm:block text-xs font-bold text-gray-700 max-w-[80px] truncate">{{ userName }}</span>
              <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
            </button>
            <!-- Dropdown -->
            <div class="absolute right-0 top-full mt-2 w-52 bg-white border border-gray-100 rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right scale-95 group-hover:scale-100 py-1 overflow-hidden z-[60]">
              <div class="px-4 py-3 border-b border-gray-50 bg-gray-50/50">
                <p class="text-sm font-bold text-[#1f3728] truncate">{{ userName }}</p>
                <p class="text-[11px] text-gray-500 truncate mt-0.5">{{ currentUser?.email }}</p>
              </div>
              <div class="p-1.5 space-y-0.5">
                <router-link to="/profile" class="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#1f3728] font-medium rounded-xl transition-colors">
                  <UserCircle class="w-4 h-4" /> Hồ sơ cá nhân
                </router-link>
                <router-link to="/borrowed" class="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#1f3728] font-medium rounded-xl transition-colors">
                  <BookOpen class="w-4 h-4" /> Sách đã mượn
                </router-link>
                <div class="h-px bg-gray-100 mx-2 my-1"></div>
                <button @click="handleLogout" class="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 font-medium rounded-xl transition-colors">
                  <LogOut class="w-4 h-4" /> Đăng xuất
                </button>
              </div>
            </div>
          </div>

          <!-- Login button if not logged in -->
          <div v-else class="flex items-center gap-2">
            <router-link to="/login" class="text-xs font-bold px-4 py-2 rounded-xl border border-gray-200 text-gray-700 hover:border-[#1f3728] hover:text-[#1f3728] transition-all">
              Đăng nhập
            </router-link>
            <router-link to="/register" class="text-xs font-bold px-4 py-2 rounded-xl bg-[#1f3728] text-white hover:bg-[#16241c] transition-colors">
              Đăng ký
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <!-- ===== CART PANEL ===== -->
    <transition name="slide-right">
      <div v-if="showCart" class="fixed inset-0 z-[100] flex justify-end" @click.self="showCart = false">
        <!-- Overlay -->
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="showCart = false"></div>
        <!-- Panel -->
        <div class="relative w-full max-w-md bg-white shadow-2xl flex flex-col h-full animate-slide-from-right">
          <!-- Header -->
          <div class="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-[#1f3728]">
            <div class="flex items-center gap-3">
              <ShoppingBag class="w-5 h-5 text-white" />
              <h2 class="text-base font-bold text-white">Giỏ mượn sách</h2>
              <span class="bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-full">{{ cartCount }}</span>
            </div>
            <button @click="showCart = false" class="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all">
              <X class="w-5 h-5" />
            </button>
          </div>

          <!-- Empty -->
          <div v-if="cartCount === 0" class="flex-1 flex flex-col items-center justify-center text-center px-6 py-16">
            <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <ShoppingBag class="w-10 h-10 text-gray-300" />
            </div>
            <p class="text-gray-500 font-semibold mb-2">Giỏ mượn trống</p>
            <p class="text-gray-400 text-sm mb-6">Hãy thêm sách bạn muốn mượn vào đây</p>
            <router-link to="/books" @click="showCart = false"
              class="text-sm font-bold px-6 py-2.5 bg-[#1f3728] text-white rounded-xl hover:bg-[#16241c] transition-colors">
              Khám phá sách
            </router-link>
          </div>

          <!-- Cart Items -->
          <div v-else class="flex-1 overflow-y-auto divide-y divide-gray-50">
            <div v-for="item in cart" :key="item._id"
              class="flex items-start gap-3 p-4 hover:bg-gray-50/50 transition-colors group">
              <!-- Cover -->
              <div class="w-14 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 shadow-sm">
                <img v-if="item.cover" :src="item.cover" :alt="item.title" class="w-full h-full object-cover" />
                <div v-else class="w-full h-full flex items-center justify-center">
                  <BookOpen class="w-6 h-6 text-gray-300" />
                </div>
              </div>
              <!-- Info -->
              <div class="flex-1 min-w-0">
                <p class="font-bold text-sm text-[#1f3728] line-clamp-2 mb-0.5">{{ item.title }}</p>
                <p class="text-xs text-gray-500 mb-1">{{ item.author }}</p>
                <p class="text-xs text-[#1f3728] font-bold">
                  {{ new Intl.NumberFormat('vi-VN').format(item.price) }} đ/lần
                </p>
                <div class="mt-1.5">
                  <span v-if="item.availableCopies > 0" class="text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                    Còn sẵn
                  </span>
                  <span v-else class="text-[10px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                    Hết sách
                  </span>
                </div>
              </div>
              <!-- Remove -->
              <button @click="removeFromCart(item._id)"
                class="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100 flex-shrink-0">
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- Footer -->
          <div v-if="cartCount > 0" class="px-6 py-5 border-t border-gray-100 bg-gray-50/80 space-y-3">
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-500 font-medium">Tổng cộng {{ cartCount }} cuốn sách</span>
              <span class="font-bold text-[#1f3728]">
                {{ new Intl.NumberFormat('vi-VN').format(totalCartPrice) }} đ
              </span>
            </div>
            <button @click="borrowAllFromCart"
              :disabled="isBorrowing || cartCount === 0"
              class="w-full py-3 bg-[#1f3728] text-white font-bold text-sm rounded-xl hover:bg-[#16241c] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm">
              <Loader2 v-if="isBorrowing" class="w-4 h-4 animate-spin" />
              <BookPlus v-else class="w-4 h-4" />
              {{ isBorrowing ? 'Đang gửi yêu cầu...' : 'Đăng ký mượn tất cả' }}
            </button>
            <button @click="clearCart"
              class="w-full py-2 text-gray-500 text-xs font-semibold hover:text-red-600 transition-colors">
              Xóa tất cả
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- ===== NOTIFICATION PANEL ===== -->
    <transition name="slide-right">
      <div v-if="showNotification" class="fixed inset-0 z-[100] flex justify-end" @click.self="showNotification = false">
        <!-- Overlay -->
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="showNotification = false"></div>
        <!-- Panel -->
        <div class="relative w-full max-w-sm bg-white shadow-2xl flex flex-col h-full">
          <!-- Header -->
          <div class="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <Bell class="w-5 h-5 text-[#1f3728]" />
              <h2 class="text-base font-bold text-[#1f3728]">Thông báo</h2>
              <span v-if="unreadCount > 0" class="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">{{ unreadCount }} mới</span>
            </div>
            <div class="flex items-center gap-2">
              <button v-if="notificationList.length > 0" @click="markAllAsRead" class="text-[11px] font-semibold text-[#1f3728] hover:underline">Đọc hết</button>
              <button @click="showNotification = false" class="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
                <X class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- Empty -->
          <div v-if="notificationList.length === 0" class="flex-1 flex flex-col items-center justify-center text-center px-6 py-16">
            <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Bell class="w-10 h-10 text-gray-300" />
            </div>
            <p class="text-gray-500 font-semibold">Không có thông báo</p>
            <p class="text-gray-400 text-sm mt-1">Các thông báo mới sẽ xuất hiện ở đây</p>
          </div>

          <!-- Notifications List -->
          <div v-else class="flex-1 overflow-y-auto divide-y divide-gray-50">
            <div v-for="notif in notificationList" :key="notif.id"
              @click="markAsRead(notif.id)"
              :class="['flex gap-3 p-4 hover:bg-gray-50 cursor-pointer transition-colors group', !notif.read ? 'bg-blue-50/40' : '']">
              <!-- Icon -->
              <div :class="['w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5', 
                notif.type === 'success' ? 'bg-green-100 text-green-600' :
                notif.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                notif.type === 'error' ? 'bg-red-100 text-red-600' :
                'bg-blue-100 text-blue-600']">
                <CheckCircle2 v-if="notif.type === 'success'" class="w-4 h-4" />
                <AlertTriangle v-else-if="notif.type === 'warning'" class="w-4 h-4" />
                <XCircle v-else-if="notif.type === 'error'" class="w-4 h-4" />
                <Info v-else class="w-4 h-4" />
              </div>
              <!-- Content -->
              <div class="flex-1 min-w-0">
                <p class="text-sm font-bold text-gray-800">{{ notif.title }}</p>
                <p class="text-xs text-gray-500 mt-0.5 line-clamp-2">{{ notif.message }}</p>
                <p class="text-[10px] text-gray-400 mt-1">{{ formatTime(notif.createdAt) }}</p>
              </div>
              <!-- Unread dot & delete -->
              <div class="flex flex-col items-end gap-2 flex-shrink-0">
                <div v-if="!notif.read" class="w-2 h-2 rounded-full bg-blue-500 mt-1.5"></div>
                <button @click.stop="removeNotification(notif.id)"
                  class="opacity-0 group-hover:opacity-100 p-1 text-gray-300 hover:text-red-500 transition-all">
                  <X class="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div v-if="notificationList.length > 0" class="px-6 py-4 border-t border-gray-100">
            <button @click="clearAllNotifications" class="w-full text-xs font-semibold text-gray-400 hover:text-red-500 transition-colors">
              Xóa tất cả thông báo
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Main Content -->
    <main class="flex-1">
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
            <li><router-link to="/guide" class="text-white/70 hover:text-white transition-colors text-sm">Hướng dẫn mượn</router-link></li>
            <li><router-link to="/contact" class="text-white/70 hover:text-white transition-colors text-sm">Liên hệ</router-link></li>
            <li><router-link to="/books" class="text-white/70 hover:text-white transition-colors text-sm">Danh mục sách</router-link></li>
          </ul>
        </div>
        <div>
          <h3 class="font-bold mb-5 uppercase tracking-wider text-sm">Địa Chỉ</h3>
          <ul class="space-y-3">
            <li class="text-white/70 text-sm leading-relaxed">Tầng 10, Tòa nhà Spacesoul<br>Quận 1, Thành phố Hồ Chí Minh</li>
            <li class="text-white/70 text-sm mt-4">Hotline: 1900 1234<br>Email: contact@spacesoul.vn</li>
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
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Bell, UserCircle, ShoppingBag, BookOpen, BookPlus, X, Trash2,
  ChevronDown, LogOut, Loader2, CheckCircle2, AlertTriangle, XCircle, Info
} from 'lucide-vue-next'
import { authService } from '@/services/auth'
import { borrowService } from '@/services/borrow'
import {
  cart, cartCount, removeFromCart, clearCart,
  notificationList, unreadCount, markAsRead, markAllAsRead, removeNotification, clearAllNotifications, addNotification
} from '@/stores/useAppStore'

const route = useRoute()
const router = useRouter()

const showCart = ref(false)
const showNotification = ref(false)
const isBorrowing = ref(false)

const isLoggedIn = computed(() => authService.isAuthenticated())
const currentUser = computed(() => authService.getCurrentUser())
const isEmployee = computed(() => currentUser.value?.type === 'Employee')
const userName = computed(() => {
  const u = currentUser.value
  if (!u) return ''
  return `${u.lastName || ''} ${u.firstName || ''}`.trim() || u.email || 'User'
})
const userInitial = computed(() => currentUser.value?.firstName?.charAt(0)?.toUpperCase() || '?')

const totalCartPrice = computed(() => cart.value.reduce((sum, item) => sum + (item.price || 0), 0))

const toggleCart = () => {
  showCart.value = !showCart.value
  if (showCart.value) showNotification.value = false
}
const toggleNotification = () => {
  showNotification.value = !showNotification.value
  if (showNotification.value) showCart.value = false
}

const borrowAllFromCart = async () => {
  if (!isLoggedIn.value) {
    router.push('/login')
    return
  }
  isBorrowing.value = true
  const results = { success: 0, failed: 0, errors: [] }

  for (const item of [...cart.value]) {
    try {
      await borrowService.createBorrowRequest(item._id)
      removeFromCart(item._id)
      results.success++
    } catch (err) {
      results.failed++
      results.errors.push(`"${item.title}": ${err.message}`)
    }
  }

  isBorrowing.value = false
  showCart.value = false

  if (results.success > 0) {
    addNotification({
      title: 'Đăng ký mượn thành công!',
      message: `Đã gửi yêu cầu mượn ${results.success} cuốn sách. Vui lòng chờ thủ thư duyệt.`,
      type: 'success'
    })
  }
  if (results.failed > 0) {
    addNotification({
      title: 'Một số sách không thể mượn',
      message: results.errors.join('; '),
      type: 'warning'
    })
  }
  if (results.success > 0) {
    router.push('/borrowed')
  }
}

const handleLogout = () => {
  authService.logout()
  router.push('/login')
}

const formatTime = (iso) => {
  const d = new Date(iso)
  const now = new Date()
  const diff = Math.floor((now - d) / 1000)
  if (diff < 60) return 'Vừa xong'
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`
  return d.toLocaleDateString('vi-VN')
}
</script>

<style scoped>
.font-title { font-family: 'Inter', sans-serif; }

/* Slide right panel */
.slide-right-enter-active,
.slide-right-leave-active {
  transition: opacity 0.25s ease;
}
.slide-right-enter-from,
.slide-right-leave-to {
  opacity: 0;
}

/* Page transition */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.page-enter-from { opacity: 0; transform: translateY(8px); }
.page-leave-to { opacity: 0; transform: translateY(-8px); }
</style>
