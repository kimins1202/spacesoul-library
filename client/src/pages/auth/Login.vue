<template>
  <div class="flex-1 flex bg-white min-h-[calc(100vh-80px-300px)]">
    <!-- Left: Image Cover -->
    <div class="hidden lg:flex flex-1 relative bg-[#1f3728]">
      <img src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1200&auto=format&fit=crop" class="absolute inset-0 w-full h-full object-cover opacity-70" alt="Library" />
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
      <div class="absolute bottom-0 left-0 p-16 z-10">
        <h1 class="text-4xl md:text-5xl font-bold text-white font-title leading-tight mb-4 shadow-sm">
          Nơi tri thức hội ngộ<br/>nghệ thuật
        </h1>
        <p class="text-white/90 text-lg max-w-md font-medium leading-relaxed">
          Khám phá không gian lưu trữ tinh hoa nhân loại trong một trải nghiệm hiện đại và sang trọng bậc nhất.
        </p>
      </div>
    </div>

    <!-- Right: Login Form -->
    <div class="flex-1 flex flex-col justify-center items-center py-16 px-6">
      <div class="w-full max-w-md">
        <h2 class="text-3xl font-bold text-[#1f3728] mb-2 font-title">Chào mừng trở lại</h2>
        <p class="text-gray-500 mb-8 text-sm font-medium">Vui lòng đăng nhập vào tài khoản thư viện của bạn.</p>

        <!-- Error message -->
        <div v-if="errorMsg" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium flex items-center gap-2">
          <AlertCircle class="w-4 h-4 flex-shrink-0" />
          {{ errorMsg }}
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label class="block text-[11px] font-bold text-[#1f3728] uppercase tracking-wider mb-2">Email</label>
            <div class="relative">
              <AtSign class="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="login-email"
                v-model="email"
                type="email"
                placeholder="username@spacesoul.vn"
                class="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-[#1f3728] focus:ring-1 focus:ring-[#1f3728] transition-all text-sm font-medium"
                required
              />
            </div>
          </div>

          <div>
            <div class="flex justify-between items-center mb-2">
              <label class="block text-[11px] font-bold text-[#1f3728] uppercase tracking-wider">Mật khẩu</label>
              <a href="#" class="text-[11px] font-bold text-gray-400 hover:text-[#1f3728]">Quên mật khẩu?</a>
            </div>
            <div class="relative">
              <Lock class="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="login-password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                class="w-full pl-12 pr-12 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-[#1f3728] focus:ring-1 focus:ring-[#1f3728] transition-all text-sm tracking-widest font-medium"
                required
              />
              <button type="button" @click="showPassword = !showPassword" class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1f3728] transition-colors">
                <Eye class="w-5 h-5" v-if="!showPassword" />
                <EyeOff class="w-5 h-5" v-else />
              </button>
            </div>
          </div>

          <button
            id="login-submit"
            type="submit"
            :disabled="isLoading"
            class="w-full bg-[#344d3d] hover:bg-[#1f3728] text-white py-3.5 rounded-xl font-bold transition-colors text-[13px] uppercase tracking-wider shadow-md disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Loader2 v-if="isLoading" class="w-4 h-4 animate-spin" />
            {{ isLoading ? 'Đang đăng nhập...' : 'ĐĂNG NHẬP NGAY' }}
          </button>
        </form>

        <p class="text-center text-[13px] text-gray-500 font-medium mt-8">
          Chưa có tài khoản? 
          <router-link to="/register" class="font-bold text-[#344d3d] hover:underline">Đăng ký thành viên mới</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { AtSign, Lock, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-vue-next'
import { authService } from '@/services/auth'

const router = useRouter()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const isLoading = ref(false)
const errorMsg = ref('')

const handleLogin = async () => {
  errorMsg.value = ''
  isLoading.value = true
  try {
    const data = await authService.login(email.value, password.value)
    // Chuyển hướng: nhân viên (Employee) -> /admin, độc giả (Reader) -> /
    if (data.user?.type === 'Employee') {
      router.push('/admin/dashboard')
    } else {
      router.push('/')
    }
  } catch (err) {
    errorMsg.value = err.message || 'Đăng nhập thất bại. Vui lòng thử lại.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.font-title {
  font-family: 'Inter', sans-serif;
}
</style>

