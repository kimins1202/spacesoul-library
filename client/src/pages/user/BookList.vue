<template>
  <div class="booklist-view">
    <h2>Danh Sách Sách</h2>
    <!-- 
      TODO: Thiết kế giao diện danh sách sách bao gồm:
      - Thanh bộ lọc (Filters): Tìm kiếm từ khóa, Lọc theo Thể loại, Lọc theo Trạng thái (Còn sách/Hết sách)
      - Lưới hiển thị danh sách sách (Book Cards Grid):
        + Mỗi card hiển thị: Ảnh bìa, Tên sách, Tác giả, Thể loại, Nút "Chi tiết"
        + Thêm nhãn (Badge) "Sẵn sàng" hoặc "Hết sách" dựa trên số lượng copies
      - Phân trang (Pagination) nếu số lượng sách nhiều
    -->
    <p>Giao diện Danh sách các đầu sách trong thư viện</p>
  </div>
</template>

<script setup>
// TODO: Tự viết logic Danh sách sách ở đây:
// 1. Import bookService từ '@/services/book.js'
// 2. Định nghĩa các ref phản hồi: books (mảng chứa sách), searchQuery (từ khóa tìm kiếm), selectedCategory (thể loại)
// 3. Viết hàm loadBooks() để fetch danh sách sách từ backend dựa trên bộ lọc hiện tại
// 4. Theo dõi sự thay đổi của bộ lọc (watch) để tự động gọi lại hàm loadBooks()
</script>

<style scoped>
/* TODO: Tự viết CSS của bạn tại đây */
</style>
