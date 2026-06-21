<template>
  <div class="borrowed-books-view">
    <h2>Sách Đã Mượn Của Tôi</h2>
    <!-- 
      TODO: Thiết kế giao diện danh sách sách đã mượn của cá nhân:
      - Thanh lọc theo trạng thái: Tất cả | Đang mượn | Đã trả | Quá hạn | Chờ duyệt
      - Danh sách thẻ mỗi phiếu mượn hiển thị:
        + Ảnh bìa sách (nhỏ)
        + Tên sách, Tác giả
        + Ngày mượn, Ngày hạn trả
        + Trạng thái (Badge màu sắc): Đang mượn (xanh), Đã trả (xám), Quá hạn (đỏ), Chờ duyệt (vàng)
        + Nút "Hủy yêu cầu" (chỉ hiện khi trạng thái là 'pending')
      - Thông báo rỗng nếu chưa có lịch sử mượn sách
    -->
    <p>Giao diện Lịch sử mượn sách cá nhân</p>
  </div>
</template>

<script setup>
// TODO: Tự viết logic danh sách sách đã mượn:
// 1. Import borrowService từ '@/services/borrow.js'
// 2. Định nghĩa ref `myBorrows` (mảng phiếu mượn) và `activeFilter` (bộ lọc trạng thái)
// 3. Trong onMounted(), gọi borrowService.getMyBorrows() để nạp dữ liệu từ server
// 4. Dùng computed `filteredBorrows` để lọc danh sách theo `activeFilter`
// 5. Viết hàm handleCancel(borrowId):
//    - Gọi borrowService.cancelBorrowRequest(borrowId)
//    - Cập nhật lại danh sách sau khi hủy thành công
</script>

<style scoped>
/* TODO: Tự viết CSS của bạn tại đây */
</style>
