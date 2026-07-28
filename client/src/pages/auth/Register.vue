<template>
  <div class="flex-1 flex bg-white min-h-[calc(100vh-80px-300px)]">
    <!-- Left: Image Cover -->
    <div class="hidden lg:flex flex-1 relative bg-[#1f3728]">
      <img src="https://images.unsplash.com/photo-1568667256549-094345857637?q=80&w=1200&auto=format&fit=crop" class="absolute inset-0 w-full h-full object-cover opacity-70" alt="Library Space" />
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
      <div class="absolute bottom-0 left-0 p-16 z-10">
        <h1 class="text-4xl md:text-5xl font-bold text-white font-title leading-tight mb-4 shadow-sm">
          Mở khóa tri thức<br/>tại Spacesoul.
        </h1>
        <p class="text-white/90 text-lg max-w-md font-medium leading-relaxed">
          Tham gia cùng cộng đồng hơn 5.000 bạn đọc để tiếp cận kho tài liệu đa dạng và không gian học tập hiện đại bậc nhất.
        </p>
      </div>
    </div>

    <!-- Right: Register Form -->
    <div class="flex-1 flex flex-col justify-center items-center py-16 px-6">
      <div class="w-full max-w-md">
        <h2 class="text-3xl font-bold text-[#1f3728] mb-2 font-title">Đăng ký thành viên</h2>
        <p class="text-gray-500 mb-8 text-sm font-medium">Bắt đầu hành trình khám phá của bạn chỉ trong vài phút.</p>

        <!-- Error / Success message -->
        <div v-if="errorMsg" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium flex items-center gap-2">
          <AlertCircle class="w-4 h-4 flex-shrink-0" />
          {{ errorMsg }}
        </div>
        <div v-if="successMsg" class="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-medium flex items-center gap-2">
          <CheckCircle class="w-4 h-4 flex-shrink-0" />
          {{ successMsg }}
        </div>

        <form @submit.prevent="handleRegister" class="space-y-5">
          <!-- Họ lót & Tên -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[11px] font-bold text-[#1f3728] uppercase tracking-wider mb-2">Họ lót</label>
              <div class="relative">
                <UserIcon class="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="register-lastname"
                  v-model="lastName"
                  type="text"
                  placeholder="Nguyễn Văn"
                  class="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-[#1f3728] focus:ring-1 focus:ring-[#1f3728] transition-all text-sm font-medium"
                  required
                />
              </div>
            </div>
            <div>
              <label class="block text-[11px] font-bold text-[#1f3728] uppercase tracking-wider mb-2">Tên</label>
              <div class="relative">
                <UserIcon class="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="register-firstname"
                  v-model="firstName"
                  type="text"
                  placeholder="An"
                  class="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-[#1f3728] focus:ring-1 focus:ring-[#1f3728] transition-all text-sm font-medium"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label class="block text-[11px] font-bold text-[#1f3728] uppercase tracking-wider mb-2">Email</label>
            <div class="relative">
              <Mail class="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="register-email"
                v-model="email"
                type="email"
                placeholder="example@spacesoul.vn"
                class="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-[#1f3728] focus:ring-1 focus:ring-[#1f3728] transition-all text-sm font-medium"
                required
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[11px] font-bold text-[#1f3728] uppercase tracking-wider mb-2">Mật khẩu</label>
              <div class="relative">
                <Lock class="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="register-password"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="••••••••"
                  class="w-full pl-12 pr-10 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-[#1f3728] focus:ring-1 focus:ring-[#1f3728] transition-all text-sm tracking-widest font-medium"
                  minlength="8"
                  required
                />
                <button type="button" @click="showPassword = !showPassword" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1f3728] transition-colors">
                  <Eye class="w-4 h-4" v-if="!showPassword" />
                  <EyeOff class="w-4 h-4" v-else />
                </button>
              </div>
            </div>
            <div>
              <label class="block text-[11px] font-bold text-[#1f3728] uppercase tracking-wider mb-2">Xác nhận</label>
              <div class="relative">
                <ShieldCheck class="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="register-confirm"
                  v-model="confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  placeholder="••••••••"
                  class="w-full pl-12 pr-10 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-[#1f3728] focus:ring-1 focus:ring-[#1f3728] transition-all text-sm tracking-widest font-medium"
                  required
                />
                <button type="button" @click="showConfirmPassword = !showConfirmPassword" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1f3728] transition-colors">
                  <Eye class="w-4 h-4" v-if="!showConfirmPassword" />
                  <EyeOff class="w-4 h-4" v-else />
                </button>
              </div>
            </div>
          </div>

          <div class="flex items-start gap-2 py-1">
            <input type="checkbox" id="terms" v-model="acceptTerms" class="mt-0.5 w-4 h-4 rounded border-gray-300 text-[#344d3d] focus:ring-[#344d3d]" />
            <label for="terms" class="text-[11px] text-gray-500 font-bold cursor-pointer leading-relaxed">
              Tôi đồng ý với <a href="#" class="text-[#1f3728] hover:underline">Điều khoản dịch vụ</a> và <a href="#" class="text-[#1f3728] hover:underline">Chính sách bảo mật</a>.
            </label>
          </div>

          <button
            id="register-submit"
            type="submit"
            :disabled="isLoading"
            class="w-full bg-[#344d3d] hover:bg-[#1f3728] text-white py-3.5 rounded-xl font-bold transition-colors text-[13px] uppercase tracking-wider shadow-md disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Loader2 v-if="isLoading" class="w-4 h-4 animate-spin" />
            {{ isLoading ? 'Đang tạo tài khoản...' : 'TẠO TÀI KHOẢN' }}
          </button>
        </form>

        <p class="text-center text-[13px] text-gray-500 font-medium mt-8">
          Đã có tài khoản? 
          <router-link to="/login" class="font-bold text-[#344d3d] hover:underline">Đăng nhập ngay</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { User as UserIcon, Mail, Lock, ShieldCheck, Eye, EyeOff, AlertCircle, CheckCircle, Loader2 } from 'lucide-vue-next'
import { authService } from '@/services/auth'

const router = useRouter()

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const acceptTerms = ref(false)
const isLoading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

const handleRegister = async () => {
  errorMsg.value = ''
  successMsg.value = ''

  if (password.value !== confirmPassword.value) {
    errorMsg.value = 'Mật khẩu xác nhận không khớp.'
    return
  }
  if (!acceptTerms.value) {
    errorMsg.value = 'Vui lòng đồng ý với điều khoản dịch vụ.'
    return
  }

  isLoading.value = true
  try {
    await authService.register({
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      password: password.value,
    })
    successMsg.value = 'Đăng ký thành công! Đang chuyển hướng đến trang đăng nhập...'
    setTimeout(() => router.push('/login'), 1500)
  } catch (err) {
    errorMsg.value = err.message || 'Đăng ký thất bại. Vui lòng thử lại.'
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

