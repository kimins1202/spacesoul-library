<template>
  <div class="register-view glass-panel">
    <h2>Đăng Ký Độc Giả</h2>
    <!-- 
      TODO: Thiết kế Form Đăng ký bao gồm:
      - Ô nhập Tên người dùng (v-model="name")
      - Ô nhập Email độc giả (v-model="email")
      - Ô nhập Số điện thoại (v-model="phone")
      - Ô nhập Địa chỉ (v-model="address")
      - Ô nhập Mật khẩu (v-model="password")
      - Ô xác nhận Mật khẩu (v-model="confirmPassword")
      - Nút bấm Đăng ký (type="submit")
      - Liên kết chuyển về trang Đăng nhập (Login.vue)
    -->
    <p>Giao diện Đăng ký Độc giả</p>
  </div>
</template>

<script setup>
// TODO: Tự viết logic đăng ký tài khoản ở đây:
// 1. Import authService từ '@/services/auth.js'
// 2. Định nghĩa các ref: name, email, phone, address, password, confirmPassword, isLoading, errorMessage
// 3. Viết hàm handleRegister():
//    - Kiểm tra password và confirmPassword có khớp không
//    - Gọi authService.register({ name, email, phone, address, password })
//    - Nếu đăng ký thành công -> chuyển hướng về trang Đăng nhập '/login' kèm thông báo thành công
//    - Nếu thất bại -> hiển thị thông báo lỗi lên màn hình
</script>

<style scoped>
/* TODO: Tự viết CSS của bạn tại đây */
</style>
