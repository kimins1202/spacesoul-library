<template>
  <div class="user-management-view">
    <h2>Quản Lý Người Dùng</h2>
    <!-- 
      TODO: Thiết kế giao diện Quản lý Người dùng cho Admin bao gồm:

      1. THANH TÌM KIẾM & BỘ LỌC:
         - Ô tìm kiếm theo tên hoặc email
         - Bộ lọc theo trạng thái tài khoản: Tất cả | Đang hoạt động (active) | Bị khóa (locked)

      2. BẢNG DANH SÁCH ĐỘC GIẢ (<table>):
         - Các cột: STT | Avatar | Tên | Email | Số điện thoại | Ngày tham gia | Trạng thái | Hành động
         - Cột Hành động: Nút "Khóa/Mở khóa tài khoản" và Nút "Xóa"
         - Hiển thị Badge trạng thái tài khoản (active/locked) với màu sắc phân biệt
    -->
    <p>Giao diện Quản lý Người dùng (Admin)</p>
  </div>
</template>

<script setup>
// TODO: Tự viết logic Quản lý Người dùng:
// 1. Import userService từ '@/services/user.js'
// 2. Định nghĩa ref: `users` (danh sách user), `searchQuery` (từ khóa tìm kiếm), `statusFilter`
// 3. Trong onMounted(), gọi userService.getAllUsers() để nạp danh sách
// 4. Dùng computed `filteredUsers` để lọc danh sách theo searchQuery và statusFilter
// 5. Viết hàm handleDelete(userId):
//    - Hiện hộp thoại xác nhận (confirm)
//    - Gọi userService.deleteUser(userId)
//    - Tải lại danh sách người dùng
// 6. (Nâng cao) Viết hàm handleToggleStatus(user):
//    - Gọi API cập nhật trạng thái tài khoản (active <-> locked)
//    - Cần thêm route PUT /api/users/:id/status vào userRoutes.js nếu muốn thực hiện
</script>

<style scoped>
/* TODO: Tự viết CSS của bạn tại đây */
</style>
