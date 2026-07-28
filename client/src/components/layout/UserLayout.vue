<template>
  <div class="user-shell min-h-screen flex flex-col font-sans bg-[#fbfbfb] text-[#1f3728]">
    <!-- Header / Navbar -->
    <header class="user-header sticky top-0 z-50 bg-white/98 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">
      <div class="max-w-7xl mx-auto px-6 h-[76px] flex items-center justify-between gap-4">
        <!-- Logo -->
        <div class="flex items-center gap-2 flex-shrink-0">
          <router-link to="/" class="site-brand flex items-center gap-3 group">
            <span class="brand-mark">
              <img src="/spacesoul_mark_v4_transparent.png" alt="Logo Spacesoul Library" class="brand-logo-image" />
            </span>
            <span class="brand-name text-lg font-extrabold uppercase tracking-[0.04em] text-[#1f3728] group-hover:text-green-800 transition-colors">
              SPACESOUL LIBRARY
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
          <router-link v-if="isLoggedIn && !isEmployee" to="/borrowed" class="text-[11px] font-bold uppercase tracking-wider transition-colors relative py-1 group"
            :class="route.path.startsWith('/borrowed') ? 'text-[#1f3728]' : 'text-gray-500 hover:text-[#1f3728]'">
            Yêu cầu mượn
            <span class="absolute -bottom-0.5 left-0 w-full h-[2px] bg-[#1f3728] transition-transform duration-300 origin-left"
              :class="route.path.startsWith('/borrowed') ? 'scale-x-100' : 'scale-x-0'"></span>
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

          <!-- User Dropdown -->
          <div v-if="isLoggedIn" class="relative">
            <button @click="showUserMenu = !showUserMenu" :aria-expanded="showUserMenu" aria-label="Mở menu tài khoản"
              class="account-trigger flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl transition-all">
              <div class="w-7 h-7 rounded-full bg-[#1f3728] text-white flex items-center justify-center text-xs font-bold">
                {{ userInitial }}
              </div>
              <span class="hidden sm:block text-xs font-bold text-gray-700 max-w-[80px] truncate">{{ userName }}</span>
              <ChevronDown :class="['w-3.5 h-3.5 text-gray-400 transition-transform', { 'rotate-180': showUserMenu }]" />
            </button>
            <!-- Dropdown -->
            <div v-if="showUserMenu"
              class="account-dropdown absolute right-0 top-full mt-2 w-56 rounded-2xl py-1 overflow-hidden z-[60] animate-fade-in">
              <div class="account-dropdown-head px-4 py-3 border-b">
                <p class="text-sm font-bold text-[#1f3728] truncate">{{ userName }}</p>
                <p class="text-[11px] text-gray-500 truncate mt-0.5">{{ currentUser?.email }}</p>
              </div>
              <div class="p-1.5 space-y-0.5">
                <router-link to="/profile" @click="showUserMenu = false" class="account-menu-item flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-xl transition-colors">
                  <UserCircle class="w-4 h-4" /> Hồ sơ cá nhân
                </router-link>
                <router-link to="/borrowed" @click="showUserMenu = false" class="account-menu-item flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-xl transition-colors">
                  <BookOpen class="w-4 h-4" /> Yêu cầu mượn của tôi
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
            <router-link to="/register" class="register-link text-xs font-bold px-4 py-2 rounded-xl bg-[#1f3728] hover:bg-[#16241c] transition-colors">
              Đăng ký
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <!-- Mobile navigation -->
    <nav class="user-mobile-nav md:hidden" aria-label="Điều hướng di động">
      <router-link to="/" :class="{ active: route.path === '/' }">
        <House /><span>Trang chủ</span>
      </router-link>
      <router-link to="/books" :class="{ active: route.path.startsWith('/books') }">
        <LibraryBig /><span>Danh mục</span>
      </router-link>
      <router-link
        v-if="isLoggedIn && !isEmployee"
        to="/borrowed"
        :class="{ active: route.path.startsWith('/borrowed') }"
      >
        <ClipboardList /><span>Yêu cầu</span>
      </router-link>
      <router-link to="/guide" :class="{ active: route.path.startsWith('/guide') }">
        <CircleHelp /><span>Hướng dẫn</span>
      </router-link>
      <button v-if="isLoggedIn" type="button" class="mobile-logout" @click="handleLogout">
        <LogOut />
        <span>Đăng xuất</span>
      </button>
      <router-link v-else to="/contact" :class="{ active: route.path.startsWith('/contact') }">
        <MapPinned />
        <span>Liên hệ</span>
      </router-link>
    </nav>

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
              class="empty-cart-button">
              Khám phá sách
            </router-link>
          </div>

          <!-- Cart Items -->
          <div v-else class="flex-1 overflow-y-auto divide-y divide-gray-50">
            <div v-for="item in cart" :key="item._id"
              class="flex items-start gap-3 p-4 hover:bg-gray-50/50 transition-colors group">
              <!-- Cover -->
              <div class="cart-book-cover w-16 h-[92px] flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                <BookCover :src="item.cover" :title="item.title" :author="item.author" />
              </div>
              <!-- Info -->
              <div class="flex-1 min-w-0">
                <p class="font-bold text-sm text-[#1f3728] line-clamp-2 mb-0.5">{{ item.title }}</p>
                <p class="text-xs text-gray-500 mb-1">{{ item.author }}</p>
                <p class="text-xs text-[#1f3728] font-bold">
                  {{ new Intl.NumberFormat('vi-VN').format(item.price) }} đ / lượt
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
              <button @click="removeFromCart(item._id)" title="Xóa khỏi giỏ" aria-label="Xóa sách khỏi giỏ"
                class="cart-remove-button p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all flex-shrink-0">
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

    <!-- Main Content -->
    <main class="flex-1">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- Footer -->
    <footer class="user-footer bg-[#1b2a20] text-white pt-16 pb-8">
      <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-white/10 pb-12 mb-8">
        <div class="col-span-1 md:col-span-2">
          <h2 class="text-xl font-extrabold uppercase tracking-tighter mb-4">SPACESOUL LIBRARY</h2>
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
        <p>© 2026 Spacesoul Library. All rights reserved.</p>
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
  UserCircle, ShoppingBag, BookOpen, BookPlus, X, Trash2,
  ChevronDown, LogOut, Loader2, House, LibraryBig, ClipboardList,
  CircleHelp, MapPinned
} from 'lucide-vue-next'
import { authService } from '@/services/auth'
import { borrowService } from '@/services/borrow'
import BookCover from '@/components/books/BookCover.vue'
import {
  cart, cartCount, removeFromCart, clearCart
} from '@/stores/useAppStore'

const route = useRoute()
const router = useRouter()

const showCart = ref(false)
const showUserMenu = ref(false)
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

  if (results.failed > 0) {
    alert(`Không thể gửi ${results.failed} yêu cầu:\n${results.errors.join('\n')}`)
  }
  if (results.success > 0) {
    router.push('/borrowed')
  }
}

const handleLogout = () => {
  showUserMenu.value = false
  showCart.value = false
  authService.logout()
  router.replace('/login')
}

</script>

<style scoped>
.font-title { font-family: 'Be Vietnam Pro', sans-serif; }

.user-shell {
  background:
    radial-gradient(circle at 8% 12%, rgba(210, 176, 104, 0.08), transparent 28rem),
    #f7f8f4;
}

.user-header {
  background: rgba(255, 255, 252, 0.9);
  border-color: rgba(31, 55, 40, 0.08);
  box-shadow: 0 8px 30px rgba(25, 48, 34, 0.055);
}

.account-trigger {
  border: 1px solid transparent;
}

.account-trigger:hover,
.account-trigger[aria-expanded="true"] {
  border-color: #d8dfd8;
  background: #f0f3ed;
}

.account-dropdown {
  border: 1px solid #dbe1da;
  background: #fffdf9;
  box-shadow: 0 18px 42px rgba(23,55,39,.16);
}

.account-dropdown-head {
  border-color: #e5e8e2;
  background: #f2f4ef;
}

.account-menu-item {
  color: #526158;
}

.account-menu-item:hover {
  background: #eaf0e9;
  color: #1f4b35;
}

.cart-book-cover {
  border: 1px solid #dfe3dc;
  box-shadow: 0 5px 14px rgba(28,52,38,.1);
}

.cart-remove-button {
  opacity: .72;
}

.cart-remove-button:hover,
.cart-remove-button:focus-visible {
  opacity: 1;
}

.empty-cart-button {
  padding: 10px 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #173d2b;
  border-radius: 10px;
  background: #1f4935;
  color: #fff;
  font-size: .8rem;
  font-weight: 800;
  box-shadow: 0 6px 16px rgba(31,73,53,.15);
  transition: .2s ease;
}

.empty-cart-button:hover {
  background: #153624;
  transform: translateY(-1px);
}

.brand-mark {
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
}

.brand-logo-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transform: scale(1.32);
  transition: transform .25s ease;
}

.site-brand:hover .brand-logo-image {
  transform: scale(1.38);
}

.brand-name {
  text-shadow: 0 1px rgba(255,255,255,.8);
}

.register-link,
.register-link:visited,
.register-link:hover {
  color: #fff !important;
}

.user-footer {
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(circle at 15% 0%, rgba(210, 176, 104, 0.16), transparent 26rem),
    linear-gradient(135deg, #10271d, #1c3b2b 60%, #173224);
}

.user-footer::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.12;
  background-image:
    linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: linear-gradient(to right, black, transparent 75%);
}

.user-footer > div {
  position: relative;
  z-index: 1;
}

.user-mobile-nav {
  position: fixed;
  z-index: 90;
  right: 10px;
  bottom: 10px;
  left: 10px;
  min-height: 66px;
  padding: 7px 5px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  border: 1px solid rgba(31, 55, 40, .12);
  border-radius: 18px;
  background: rgba(255, 255, 252, .96);
  backdrop-filter: blur(18px);
  box-shadow: 0 16px 42px rgba(18, 45, 31, .18);
}

.user-mobile-nav a,
.user-mobile-nav button {
  min-width: 0;
  flex: 1 1 0;
  padding: 7px 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  border-radius: 12px;
  color: #7d8980;
  font-size: .58rem;
  font-weight: 800;
  white-space: nowrap;
}

.user-mobile-nav svg {
  width: 19px;
  height: 19px;
}

.user-mobile-nav a.active {
  background: #e9eee8;
  color: #1f4d36;
}

.user-mobile-nav .mobile-logout {
  color: #a2443e;
}

.user-mobile-nav .mobile-logout:active {
  background: #f6e8e5;
}

@media (max-width: 767px) {
  .user-shell {
    padding-bottom: 86px;
  }

  .user-header > div {
    height: 66px;
    padding-right: 14px;
    padding-left: 14px;
  }

  .brand-mark {
    width: 42px;
    height: 42px;
  }

  .brand-name {
    font-size: .78rem;
    letter-spacing: .02em;
  }

  .user-footer {
    margin-bottom: -86px;
    padding-bottom: 86px;
  }
}

@media (max-width: 420px) {
  .user-header > div {
    gap: 6px;
    padding-right: 10px;
    padding-left: 10px;
  }

  .site-brand {
    gap: 5px;
  }

  .brand-name {
    max-width: 92px;
    font-size: .66rem;
    line-height: 1.05;
  }

  .user-header :deep(a[href="/login"]),
  .user-header :deep(a[href="/register"]) {
    padding: 7px 9px;
    font-size: .66rem;
  }

  .user-mobile-nav a,
  .user-mobile-nav button {
    padding-inline: 4px;
  }
}

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
