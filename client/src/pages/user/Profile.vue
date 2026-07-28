<template>
  <div class="p-4 sm:p-6 max-w-2xl mx-auto">
    <h1 class="text-2xl font-bold text-[#1f3728] mb-6">Hồ sơ cá nhân</h1>

    <div v-if="isLoading" class="flex items-center justify-center py-16 text-gray-400 gap-2">
      <Loader2 class="w-5 h-5 animate-spin" />
    </div>

    <div v-else class="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      <!-- Avatar header -->
      <div class="bg-gradient-to-r from-[#1f3728] to-[#344d3d] px-5 sm:px-8 py-6 sm:py-8 flex items-center gap-4 sm:gap-5">
        <div class="w-16 h-16 rounded-full bg-white/20 text-white flex items-center justify-center text-2xl font-bold shadow-inner">
          {{ profile?.firstName?.charAt(0)?.toUpperCase() || '?' }}
        </div>
        <div>
          <p class="text-white font-bold text-xl">{{ profile?.lastName }} {{ profile?.firstName }}</p>
          <p class="text-white/70 text-sm mt-0.5">{{ profile?.email }}</p>
          <span class="mt-2 inline-block bg-white/20 text-white/90 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
            {{ profile?.type === 'Employee' ? 'Nhân viên' : 'Độc giả' }}
          </span>
        </div>
      </div>

      <div class="p-6">
        <!-- View mode -->
        <div v-if="!isEditing" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Họ lót</p>
              <p class="text-sm font-medium text-gray-800">{{ profile?.lastName || '—' }}</p>
            </div>
            <div>
              <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Tên</p>
              <p class="text-sm font-medium text-gray-800">{{ profile?.firstName || '—' }}</p>
            </div>
          </div>
          <div>
            <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Email</p>
            <p class="text-sm font-medium text-gray-800">{{ profile?.email || '—' }}</p>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Số điện thoại</p>
              <p class="text-sm font-medium text-gray-800">{{ profile?.phone || '—' }}</p>
            </div>
            <div v-if="profile?.type === 'Reader'">
              <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Giới tính</p>
              <p class="text-sm font-medium text-gray-800">{{ profile?.gender || '—' }}</p>
            </div>
            <div v-if="profile?.type === 'Employee'">
              <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Chức vụ</p>
              <p class="text-sm font-medium text-gray-800">{{ profile?.position || '—' }}</p>
            </div>
          </div>
          <div>
            <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Địa chỉ</p>
            <p class="text-sm font-medium text-gray-800">{{ profile?.address || '—' }}</p>
          </div>

          <div class="pt-4 border-t border-gray-100">
            <button @click="startEdit" class="bg-[#1f3728] text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-[#16241c] transition-colors flex items-center gap-2">
              <Edit2 class="w-4 h-4" /> Chỉnh sửa hồ sơ
            </button>
          </div>
        </div>

        <!-- Edit mode -->
        <div v-else class="space-y-4">
          <div v-if="saveError" class="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{{ saveError }}</div>
          <div v-if="saveSuccess" class="p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">Cập nhật thành công!</div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Họ lót</label>
              <input v-model="editData.lastName" type="text" class="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1f3728]" />
            </div>
            <div>
              <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Tên</label>
              <input v-model="editData.firstName" type="text" class="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1f3728]" />
            </div>
          </div>
          <div>
            <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Số điện thoại</label>
            <input v-model="editData.phone" type="text" class="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1f3728]" />
          </div>
          <div>
            <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Địa chỉ</label>
            <input v-model="editData.address" type="text" class="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1f3728]" />
          </div>
          <div v-if="profile?.type === 'Reader'" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Ngày sinh</label>
              <input v-model="editData.birthDate" type="date" class="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1f3728]" />
            </div>
            <div>
              <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Giới tính</label>
              <select v-model="editData.gender" class="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1f3728]">
                <option value="">Chọn giới tính</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
          </div>

          <div class="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-gray-100">
            <button @click="handleSave" :disabled="isSaving" class="bg-[#1f3728] text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-[#16241c] disabled:opacity-60 flex items-center gap-2 transition-colors">
              <Loader2 v-if="isSaving" class="w-4 h-4 animate-spin" />
              {{ isSaving ? 'Đang lưu...' : 'Lưu thay đổi' }}
            </button>
            <button @click="isEditing = false; saveError = ''" class="border border-gray-200 text-gray-600 px-5 py-2 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors">Hủy</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Edit2, Loader2 } from 'lucide-vue-next'
import { userService } from '@/services/user'

const profile = ref(null)
const isLoading = ref(false)
const isEditing = ref(false)
const isSaving = ref(false)
const saveError = ref('')
const saveSuccess = ref(false)
const editData = ref({})

const loadProfile = async () => {
  isLoading.value = true
  try {
    profile.value = await userService.getProfile()
  } catch (err) {
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

const startEdit = () => {
  editData.value = {
    firstName: profile.value?.firstName || '',
    lastName: profile.value?.lastName || '',
    phone: profile.value?.phone || '',
    address: profile.value?.address || '',
    birthDate: profile.value?.birthDate ? new Date(profile.value.birthDate).toISOString().split('T')[0] : '',
    gender: profile.value?.gender || '',
  }
  isEditing.value = true
  saveError.value = ''
  saveSuccess.value = false
}

const handleSave = async () => {
  isSaving.value = true
  saveError.value = ''
  saveSuccess.value = false
  try {
    const result = await userService.updateProfile(editData.value)
    profile.value = { ...profile.value, ...result.user }
    isEditing.value = false
    saveSuccess.value = true
    setTimeout(() => saveSuccess.value = false, 3000)
  } catch (err) {
    saveError.value = err.message || 'Không thể cập nhật thông tin.'
  } finally {
    isSaving.value = false
  }
}

onMounted(loadProfile)
</script>
