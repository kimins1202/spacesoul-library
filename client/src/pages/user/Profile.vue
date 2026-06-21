<template>
  <div class="profile-view glass-panel">
    <h2>Hồ Sơ Cá Nhân Độc Giả</h2>
    <!-- 
      TODO: Thiết kế giao diện Hồ sơ độc giả bao gồm:
      - Khu vực hiển thị thông tin: Ảnh đại diện (Avatar), Tên, Email, Số điện thoại, Địa chỉ, Mã thành viên, Ngày tham gia
      - Nút bấm "Chỉnh sửa hồ sơ" để bật form chỉnh sửa:
        + Các ô nhập cho phép sửa: Tên, Số điện thoại, Địa chỉ
        + Nút "Lưu thay đổi" và nút "Hủy bỏ"
      - Khu vực đổi mật khẩu (nếu cần thiết)
    -->
    <p>Giao diện Thông tin cá nhân độc giả</p>
  </div>
</template>

<script setup>
// TODO: Tự viết logic quản lý Hồ sơ người dùng:
// 1. Import userService từ '@/services/user.js'
// 2. Khai báo ref `userProfile` chứa thông tin cá nhân hiện tại
// 3. Khai báo các trạng thái: `isEditing` (boolean), `editData` (object chứa dữ liệu chỉnh sửa)
// 4. Viết hàm loadProfile() để gọi userService.getProfile() nạp thông tin cá nhân
// 5. Viết hàm handleUpdateProfile() để gọi userService.updateProfile(editData) lưu các thay đổi lên server
</script>

<style scoped>
/* TODO: Tự viết CSS của bạn tại đây */
</style>
