<template>
  <div class="book-management-view">
    <h2>Quản Lý Sách</h2>
    <!-- 
      TODO: Thiết kế giao diện Quản lý Sách cho Admin bao gồm:

      1. THANH TIÊU ĐỀ & HÀNH ĐỘNG:
         - Tiêu đề trang "Quản lý sách"
         - Nút "Thêm sách mới" (mở modal/form thêm sách)

      2. BẢNG DANH SÁCH SÁCH (<table>):
         - Các cột: STT | Ảnh bìa | Tên sách | Tác giả | Thể loại | Tổng số cuốn | Còn lại | Hành động
         - Cột Hành động: Nút "Sửa" và Nút "Xóa" cho mỗi hàng

      3. MODAL THÊM / SỬA SÁCH (Form nhập liệu):
         - Các trường: Tên sách, Tác giả, Nhà xuất bản, Năm xuất bản, Thể loại, Mô tả, Số trang, ISBN, URL Ảnh bìa, Tổng số cuốn
         - Nút "Lưu" và Nút "Hủy"
    -->
    <p>Giao diện Quản lý Sách (Admin)</p>
  </div>
</template>

<script setup>
// TODO: Tự viết logic Quản lý Sách:
// 1. Import bookService từ '@/services/book.js'
// 2. Định nghĩa ref: `books` (danh sách sách), `showModal` (boolean mở/đóng modal), `editingBook` (sách đang sửa hoặc null nếu thêm mới)
// 3. Trong onMounted(), gọi bookService.getBooks() để nạp danh sách
// 4. Viết hàm openCreateModal(): đặt editingBook = null, showModal = true
// 5. Viết hàm openEditModal(book): đặt editingBook = book, showModal = true
// 6. Viết hàm handleSave(formData):
//    - Nếu editingBook tồn tại -> gọi bookService.updateBook(editingBook._id, formData)
//    - Nếu không -> gọi bookService.createBook(formData)
//    - Sau khi lưu xong, tải lại danh sách sách và đóng modal
// 7. Viết hàm handleDelete(bookId):
//    - Hiện hộp thoại xác nhận (confirm)
//    - Gọi bookService.deleteBook(bookId)
//    - Tải lại danh sách
</script>

<style scoped>
/* TODO: Tự viết CSS của bạn tại đây */
</style>
