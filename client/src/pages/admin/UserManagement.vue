<template>
  <div class="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
    <div class="border-b border-gray-100 p-6">
      <div class="relative w-full sm:max-w-sm">
        <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input v-model="searchQuery" type="search" placeholder="Tìm kiếm độc giả..." class="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-4 text-sm font-medium focus:border-[#1f3728] focus:outline-none focus:ring-2 focus:ring-[#1f3728]/20" />
      </div>
    </div>

    <div v-if="isLoading" class="flex flex-1 items-center justify-center gap-2 py-16 text-gray-400">
      <Loader2 class="h-5 w-5 animate-spin" /><span class="text-sm font-medium">Đang tải dữ liệu...</span>
    </div>
    <div v-else-if="errorMsg" class="flex flex-1 items-center justify-center py-16 text-sm font-medium text-red-500">{{ errorMsg }}</div>

    <div v-else class="flex-1 overflow-x-auto">
      <table class="user-admin-table w-full min-w-[900px] border-collapse text-left">
        <thead class="sticky top-0 z-10 bg-gray-50/95 shadow-sm backdrop-blur-sm">
          <tr class="text-xs uppercase tracking-wider text-gray-500">
            <th class="border-b border-gray-200 px-6 py-4 font-bold">Độc giả</th>
            <th class="border-b border-gray-200 px-6 py-4 font-bold">Ngày sinh / Giới tính</th>
            <th class="border-b border-gray-200 px-6 py-4 font-bold">Số điện thoại</th>
            <th class="action-column-header border-b border-gray-200 px-5 py-4 text-center font-bold">Thao tác</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 bg-white text-sm">
          <tr v-if="filteredReaders.length === 0"><td colspan="4" class="px-6 py-12 text-center text-sm font-medium text-gray-400">Không tìm thấy độc giả nào.</td></tr>
          <tr v-for="reader in paginatedReaders" :key="reader._id" class="transition-colors hover:bg-blue-50/30">
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div class="flex h-10 w-10 items-center justify-center rounded-full border border-blue-200 bg-blue-100 text-lg font-bold text-blue-700">{{ reader.firstName?.charAt(0)?.toUpperCase() }}</div>
                <div><p class="font-bold text-[#1f3728]">{{ reader.lastName }} {{ reader.firstName }}</p><p class="text-[11px] text-gray-500">{{ reader.email }}</p></div>
              </div>
            </td>
            <td class="px-6 py-4 text-xs font-medium text-gray-600">
              <span>{{ reader.birthDate ? new Date(reader.birthDate).toLocaleDateString('vi-VN') : '—' }}</span><span v-if="reader.gender" class="ml-2 text-gray-400">· {{ reader.gender }}</span>
            </td>
            <td class="px-6 py-4 font-medium text-gray-600">{{ reader.phone || '—' }}</td>
            <td class="action-column-cell px-5 py-4">
              <div class="admin-row-actions flex items-center justify-center">
                <button class="row-action delete-action" title="Xóa độc giả" aria-label="Xóa độc giả" @click="handleDeleteReader(reader._id)"><Trash2 class="h-4 w-4" /></button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <PaginationControls v-if="!isLoading && !errorMsg" v-model:page="currentPage" :total-items="filteredReaders.length" :page-size="pageSize" />
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { Loader2, Search, Trash2 } from 'lucide-vue-next'
import PaginationControls from '@/components/admin/PaginationControls.vue'
import { userService } from '@/services/user'

const readers = ref([])
const isLoading = ref(false)
const errorMsg = ref('')
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = 10

const filteredReaders = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return readers.value
  return readers.value.filter(reader => `${reader.lastName || ''} ${reader.firstName || ''}`.toLowerCase().includes(query) || (reader.email || '').toLowerCase().includes(query))
})
const paginatedReaders = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredReaders.value.slice(start, start + pageSize)
})
watch(searchQuery, () => { currentPage.value = 1 })
watch(() => filteredReaders.value.length, total => { currentPage.value = Math.min(currentPage.value, Math.max(1, Math.ceil(total / pageSize))) })

const loadReaders = async () => {
  isLoading.value = true
  errorMsg.value = ''
  try { readers.value = await userService.getAllReaders() }
  catch (error) { errorMsg.value = error.message || 'Không thể tải dữ liệu.' }
  finally { isLoading.value = false }
}
const handleDeleteReader = async id => {
  if (!confirm('Bạn có chắc muốn xóa độc giả này?')) return
  try { await userService.deleteReader(id); readers.value = readers.value.filter(reader => reader._id !== id) }
  catch (error) { alert(error.message || 'Không thể xóa độc giả.') }
}
onMounted(loadReaders)
</script>

<style scoped>
.row-action { width: 32px; min-height: 32px; padding: 0; display: inline-flex; align-items: center; justify-content: center; gap: 5px; border: 1px solid; border-radius: 9px; font-size: 11px; font-weight: 800; white-space: nowrap; box-shadow: none; transition: background-color .2s ease; }
.delete-action { border-color: #84302c; background: #a63d38; color: white; }
.delete-action:hover { background: #84302c; }
.admin-row-actions { min-width: 0; flex-wrap: nowrap; }
.user-admin-table th, .user-admin-table td { vertical-align: middle; }
.user-admin-table th { white-space: nowrap; }
.user-admin-table th:last-child, .user-admin-table td:last-child { width: 112px; min-width: 112px; }
.action-column-header { background: #e8ede8; color: #263d30; }
.action-column-cell { border-left: 1px solid #e2e7e2; background: white; }
</style>
