<template>
  <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full">
    <!-- Tabs -->
    <div class="border-b border-gray-200 px-6 pt-4 flex gap-6">
      <button
        @click="activeTab = 'readers'"
        :class="['pb-3 text-sm font-bold border-b-2 transition-colors', activeTab === 'readers' ? 'border-[#1f3728] text-[#1f3728]' : 'border-transparent text-gray-400 hover:text-gray-600']"
      >
        Độc giả <span class="ml-1 bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-full">{{ readers.length }}</span>
      </button>
      <button
        v-if="isAdmin"
        @click="activeTab = 'employees'"
        :class="['pb-3 text-sm font-bold border-b-2 transition-colors', activeTab === 'employees' ? 'border-[#1f3728] text-[#1f3728]' : 'border-transparent text-gray-400 hover:text-gray-600']"
      >
        Nhân viên <span class="ml-1 bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-full">{{ employees.length }}</span>
      </button>
    </div>

    <!-- Toolbar -->
    <div class="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white">
      <div class="flex items-center gap-4 w-full sm:w-auto">
        <div class="relative flex-1 sm:w-64">
          <Search class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="activeTab === 'readers' ? 'Tìm kiếm độc giả...' : 'Tìm kiếm nhân viên...'"
            class="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1f3728]/20 focus:border-[#1f3728] font-medium"
          />
        </div>
        <select v-if="activeTab === 'readers'" v-model="statusFilter" class="p-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 focus:outline-none focus:border-[#1f3728] bg-gray-50 hover:bg-gray-100 transition-colors shadow-sm">
          <option value="all">Tất cả trạng thái</option>
          <option value="active">Đang hoạt động</option>
          <option value="locked">Bị khóa</option>
        </select>
      </div>
      <button
        v-if="activeTab === 'employees'"
        @click="showCreateModal = true"
        class="w-full sm:w-auto bg-[#1f3728] text-white px-5 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#16241c] transition-colors shadow-sm"
      >
        <Plus class="w-4 h-4" /> Thêm nhân viên
      </button>
    </div>

    <!-- Loading / Error -->
    <div v-if="isLoading" class="flex-1 flex items-center justify-center text-gray-400 gap-2 py-16">
      <Loader2 class="w-5 h-5 animate-spin" />
      <span class="text-sm font-medium">Đang tải dữ liệu...</span>
    </div>
    <div v-else-if="errorMsg" class="flex-1 flex items-center justify-center text-red-500 text-sm font-medium py-16">{{ errorMsg }}</div>

    <!-- Table -->
    <div v-else class="overflow-x-auto flex-1">
      <!-- READERS TAB -->
      <table v-if="activeTab === 'readers'" class="user-admin-table w-full text-left border-collapse min-w-[1100px]">
        <thead class="sticky top-0 z-10 bg-gray-50/95 backdrop-blur-sm shadow-sm">
          <tr class="text-gray-500 text-xs uppercase tracking-wider">
            <th class="px-6 py-4 font-bold border-b border-gray-200">Độc giả</th>
            <th class="px-6 py-4 font-bold border-b border-gray-200">Ngày sinh / Giới tính</th>
            <th class="px-6 py-4 font-bold border-b border-gray-200">Số điện thoại</th>
            <th class="px-6 py-4 font-bold text-center border-b border-gray-200">Trạng thái</th>
            <th class="action-column-header px-5 py-4 font-bold text-center border-b border-gray-200">Thao tác</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 text-sm bg-white">
          <tr v-if="filteredReaders.length === 0">
            <td colspan="5" class="px-6 py-12 text-center text-gray-400 text-sm font-medium">Không tìm thấy độc giả nào.</td>
          </tr>
          <tr
            v-for="reader in paginatedReaders"
            :key="reader._id"
            :class="['hover:bg-blue-50/30 transition-colors group', reader.status === 'locked' ? 'bg-red-50/20' : '']"
          >
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div :class="['w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-sm border', reader.status === 'locked' ? 'bg-red-100 text-red-700 border-red-200' : 'bg-blue-100 text-blue-700 border-blue-200']">
                  {{ reader.firstName?.charAt(0)?.toUpperCase() }}
                </div>
                <div>
                  <p class="font-bold text-[#1f3728]">{{ reader.lastName }} {{ reader.firstName }}</p>
                  <p class="text-[11px] text-gray-500">{{ reader.email }}</p>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 text-gray-600 font-medium text-xs">
              <span v-if="reader.birthDate">{{ new Date(reader.birthDate).toLocaleDateString('vi-VN') }}</span>
              <span v-else class="text-gray-300">—</span>
              <span v-if="reader.gender" class="ml-2 text-gray-400">· {{ reader.gender }}</span>
            </td>
            <td class="px-6 py-4 text-gray-600 font-medium">{{ reader.phone || '—' }}</td>
            <td class="px-6 py-4 text-center">
              <span :class="['px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border', reader.status === 'active' ? 'bg-green-100/50 border-green-200 text-green-700' : 'bg-red-100/50 border-red-200 text-red-700']">
                {{ reader.status === 'active' ? 'Hoạt động' : 'Bị khóa' }}
              </span>
            </td>
            <td class="action-column-cell px-5 py-4">
              <div class="admin-row-actions flex items-center justify-end gap-2">
                <button @click="handleToggleStatus(reader)" :class="['row-action', reader.status === 'active' ? 'lock-action' : 'unlock-action']" :title="reader.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa'" :aria-label="reader.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'">
                  <Lock class="w-4 h-4" v-if="reader.status === 'active'" />
                  <Unlock class="w-4 h-4" v-else />
                </button>
                <button @click="handleDeleteReader(reader._id)" class="row-action delete-action" title="Xóa người dùng" aria-label="Xóa người dùng">
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- EMPLOYEES TAB -->
      <table v-else class="user-admin-table w-full text-left border-collapse min-w-[820px]">
        <thead class="sticky top-0 z-10 bg-gray-50/95 backdrop-blur-sm shadow-sm">
          <tr class="text-gray-500 text-xs uppercase tracking-wider">
            <th class="px-6 py-4 font-bold border-b border-gray-200">Nhân viên</th>
            <th class="px-6 py-4 font-bold border-b border-gray-200">Chức vụ</th>
            <th class="px-6 py-4 font-bold border-b border-gray-200">Số điện thoại</th>
            <th class="px-6 py-4 font-bold text-center border-b border-gray-200">Trạng thái</th>
            <th class="action-column-header px-5 py-4 font-bold text-center border-b border-gray-200">Thao tác</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 text-sm bg-white">
          <tr v-if="filteredEmployees.length === 0">
            <td colspan="5" class="px-6 py-12 text-center text-gray-400 text-sm font-medium">Không tìm thấy nhân viên nào.</td>
          </tr>
          <tr
            v-for="emp in paginatedEmployees"
            :key="emp._id"
            class="hover:bg-blue-50/30 transition-colors group"
          >
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-[#1f3728] text-white flex items-center justify-center font-bold text-lg shadow-sm">
                  {{ emp.firstName?.charAt(0)?.toUpperCase() }}
                </div>
                <div>
                  <p class="font-bold text-[#1f3728]">{{ emp.lastName }} {{ emp.firstName }}</p>
                  <p class="text-[11px] text-gray-500">{{ emp.email }}</p>
                </div>
              </div>
            </td>
            <td class="px-6 py-4">
              <span class="bg-[#1f3728] text-white border border-[#1f3728] px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                {{ emp.position || 'Nhân viên' }}
              </span>
            </td>
            <td class="px-6 py-4 text-gray-600 font-medium">{{ emp.phone || '—' }}</td>
            <td class="px-6 py-4 text-center">
              <span class="bg-green-100/50 border border-green-200 text-green-700 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                {{ emp.status === 'active' ? 'Hoạt động' : 'Bị khóa' }}
              </span>
            </td>
            <td class="action-column-cell px-5 py-4">
              <div class="admin-row-actions flex items-center justify-end gap-2">
                <button @click="handleDeleteEmployee(emp._id)" class="row-action delete-action" title="Xóa nhân viên" aria-label="Xóa nhân viên">
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <PaginationControls
      v-if="!isLoading && !errorMsg"
      v-model:page="currentPage"
      :total-items="activeTab === 'readers' ? filteredReaders.length : filteredEmployees.length"
      :page-size="pageSize"
    />

    <!-- Create Employee Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <h3 class="text-lg font-bold text-[#1f3728] mb-4">Thêm nhân viên mới</h3>
        <div v-if="modalError" class="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{{ modalError }}</div>
        <div class="space-y-3">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Họ lót</label>
              <input v-model="newEmp.lastName" type="text" class="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1f3728]" placeholder="Nguyễn Văn" />
            </div>
            <div>
              <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Tên</label>
              <input v-model="newEmp.firstName" type="text" class="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1f3728]" placeholder="An" />
            </div>
          </div>
          <div>
            <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Email</label>
            <input v-model="newEmp.email" type="email" class="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1f3728]" placeholder="nv@spacesoul.vn" />
          </div>
          <div>
            <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Mật khẩu</label>
            <input v-model="newEmp.password" type="password" class="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1f3728]" placeholder="Ít nhất 8 ký tự" />
          </div>
          <div>
            <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Chức vụ</label>
            <input v-model="newEmp.position" type="text" class="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1f3728]" placeholder="Thủ thư, Quản lý..." />
          </div>
        </div>
        <div class="flex gap-3 mt-5">
          <button @click="showCreateModal = false; modalError = ''" class="flex-1 border border-gray-200 text-gray-600 py-2 rounded-lg text-sm font-bold hover:bg-gray-50">Hủy</button>
          <button @click="handleCreateEmployee" :disabled="isCreating" class="flex-1 bg-[#1f3728] text-white py-2 rounded-lg text-sm font-bold hover:bg-[#16241c] disabled:opacity-60 flex items-center justify-center gap-2">
            <Loader2 v-if="isCreating" class="w-4 h-4 animate-spin" />
            {{ isCreating ? 'Đang tạo...' : 'Tạo nhân viên' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { Search, Plus, Trash2, Lock, Unlock, Loader2 } from 'lucide-vue-next'
import { userService } from '@/services/user'
import PaginationControls from '@/components/admin/PaginationControls.vue'

import { authService } from '@/services/auth'

const adminUser = authService.getCurrentUser()
const isAdmin = adminUser && adminUser.role === 'admin'

const activeTab = ref('readers')
const readers = ref([])
const employees = ref([])
const isLoading = ref(false)
const errorMsg = ref('')
const searchQuery = ref('')
const statusFilter = ref('all')
const currentPage = ref(1)
const pageSize = 10

const showCreateModal = ref(false)
const isCreating = ref(false)
const modalError = ref('')
const newEmp = ref({ firstName: '', lastName: '', email: '', password: '', position: '' })

const filteredReaders = computed(() => {
  return readers.value.filter(r => {
    const fullName = `${r.lastName} ${r.firstName}`.toLowerCase()
    const matchSearch = fullName.includes(searchQuery.value.toLowerCase()) || r.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchStatus = statusFilter.value === 'all' || r.status === statusFilter.value
    return matchSearch && matchStatus
  })
})

const filteredEmployees = computed(() => {
  return employees.value.filter(e => {
    const fullName = `${e.lastName} ${e.firstName}`.toLowerCase()
    return fullName.includes(searchQuery.value.toLowerCase()) || e.email.toLowerCase().includes(searchQuery.value.toLowerCase())
  })
})

const paginatedReaders = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredReaders.value.slice(start, start + pageSize)
})

const paginatedEmployees = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredEmployees.value.slice(start, start + pageSize)
})

watch([searchQuery, statusFilter, activeTab], () => {
  currentPage.value = 1
})

watch(
  () => activeTab.value === 'readers' ? filteredReaders.value.length : filteredEmployees.value.length,
  (total) => {
    currentPage.value = Math.min(currentPage.value, Math.max(1, Math.ceil(total / pageSize)))
  }
)

const loadData = async () => {
  isLoading.value = true
  errorMsg.value = ''
  try {
    if (isAdmin) {
      const [readersData, employeesData] = await Promise.all([
        userService.getAllReaders(),
        userService.getAllEmployees(),
      ])
      readers.value = readersData
      employees.value = employeesData
    } else {
      readers.value = await userService.getAllReaders()
    }
  } catch (err) {
    errorMsg.value = err.message || 'Không thể tải dữ liệu.'
  } finally {
    isLoading.value = false
  }
}

const handleToggleStatus = async (reader) => {
  try {
    await userService.toggleReaderStatus(reader._id)
    reader.status = reader.status === 'active' ? 'locked' : 'active'
  } catch (err) {
    alert(err.message || 'Không thể cập nhật trạng thái.')
  }
}

const handleDeleteReader = async (id) => {
  if (!confirm('Bạn có chắc muốn xóa độc giả này?')) return
  try {
    await userService.deleteReader(id)
    readers.value = readers.value.filter(r => r._id !== id)
  } catch (err) {
    alert(err.message || 'Không thể xóa độc giả.')
  }
}

const handleDeleteEmployee = async (id) => {
  if (!confirm('Bạn có chắc muốn xóa nhân viên này?')) return
  try {
    await userService.deleteEmployee(id)
    employees.value = employees.value.filter(e => e._id !== id)
  } catch (err) {
    alert(err.message || 'Không thể xóa nhân viên.')
  }
}

const handleCreateEmployee = async () => {
  modalError.value = ''
  if (!newEmp.value.firstName || !newEmp.value.lastName || !newEmp.value.email || !newEmp.value.password) {
    modalError.value = 'Vui lòng điền đầy đủ thông tin.'
    return
  }
  isCreating.value = true
  try {
    const result = await userService.createEmployee(newEmp.value)
    employees.value.push(result.employee)
    showCreateModal.value = false
    newEmp.value = { firstName: '', lastName: '', email: '', password: '', position: '' }
  } catch (err) {
    modalError.value = err.message || 'Không thể tạo nhân viên.'
  } finally {
    isCreating.value = false
  }
}

onMounted(loadData)
</script>

<style scoped>
.row-action {
  width: 32px;
  min-height: 32px;
  padding: 0;
  justify-content: center;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  border: 1px solid;
  border-radius: 9px;
  font-size: 11px;
  font-weight: 800;
  white-space: nowrap;
  box-shadow: none;
}
.lock-action { border-color: #9a651b; background: #a96d1d; color: #fff; }
.lock-action:hover { background: #825114; }
.unlock-action { border-color: #185637; background: #1f6a43; color: #fff; }
.unlock-action:hover { background: #174f34; }
.delete-action { border-color: #84302c; background: #a63d38; color: #fff; }
.delete-action:hover { background: #84302c; }

.user-admin-table th,
.user-admin-table td {
  vertical-align: middle;
}
.user-admin-table th {
  white-space: nowrap;
}
.user-admin-table th:last-child,
.user-admin-table td:last-child {
  width: 112px;
  min-width: 112px;
}
.admin-row-actions {
  min-width: 0;
  justify-content: center;
  flex-wrap: nowrap;
}
.action-column-header { background: #e8ede8; color: #263d30; }
.action-column-cell { border-left: 1px solid #e2e7e2; background: #fff; }
</style>

