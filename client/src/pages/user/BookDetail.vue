<template>
  <div class="book-detail-view glass-panel">
    <h2>Chi Tiết Sách</h2>
    <!-- 
      TODO: Thiết kế giao diện chi tiết sách bao gồm:
      - Cột trái: Ảnh bìa lớn của sách
      - Cột phải:
        + Tên sách, Tác giả, Nhà xuất bản, Năm phát hành, Mã ISBN, Số trang
        + Điểm đánh giá (Rating)
        + Mô tả chi tiết cuốn sách (Description)
        + Trạng thái hiện tại (Còn bao nhiêu cuốn để mượn)
        + Nút bấm "Đăng ký mượn sách" (Chỉ hiện khi còn sách và độc giả đã đăng nhập)
    -->
    <p>Giao diện Thông tin chi tiết một cuốn sách</p>
  </div>
</template>

<script setup>
// TODO: Tự viết logic Chi tiết sách ở đây:
// 1. Nhận prop `id` từ Route hoặc dùng useRoute() để lấy ID cuốn sách
// 2. Import bookService từ '@/services/book.js' và borrowService từ '@/services/borrow.js'
// 3. Gọi hook onMounted() để tải dữ liệu chi tiết sách từ API getBookById(id)
// 4. Viết hàm handleBorrow():
//    - Kiểm tra người dùng đã đăng nhập chưa, nếu chưa -> chuyển hướng sang '/login'
//    - Gọi borrowService.createBorrowRequest(bookId) để gửi yêu cầu mượn lên Backend
//    - Hiển thị thông báo kết quả (Thành công/Thất bại) cho người dùng
</script>

<style scoped>
/* TODO: Tự viết CSS của bạn tại đây */
</style>
