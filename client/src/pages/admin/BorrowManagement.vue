<template>
  <div class="borrow-management-view">
    <h2>Quản Lý Mượn Trả</h2>
    <!-- 
      TODO: Thiết kế giao diện Quản lý Mượn Trả cho Admin bao gồm:

      1. THANH LỌC TRẠNG THÁI:
         - Tabs hoặc dropdown lọc: Tất cả | Chờ duyệt (pending) | Đang mượn (borrowing) | Quá hạn (overdue) | Đã trả (returned)

      2. BẢNG DANH SÁCH PHIẾU MƯỢN (<table>):
         - Các cột: STT | Độc giả | Cuốn sách | Ngày mượn | Hạn trả | Ngày trả thực tế | Trạng thái | Hành động
         - Cột Hành động tùy theo trạng thái:
           + Nếu 'pending'   -> Nút "Phê duyệt" (xanh lá) + Nút "Từ chối" (đỏ)
           + Nếu 'borrowing' -> Nút "Xác nhận đã trả" (xanh dương)
           + Các trạng thái khác: Không có hành động
    -->
    <p>Giao diện Quản lý Mượn Trả Sách (Admin)</p>
  </div>
</template>

<script setup>
// TODO: Tự viết logic Quản lý Mượn Trả:
// 1. Import borrowService từ '@/services/borrow.js'
// 2. Định nghĩa ref: `borrows` (danh sách phiếu mượn), `activeFilter` (bộ lọc trạng thái, mặc định là 'all')
// 3. Trong onMounted(), gọi borrowService.getAllBorrows() để nạp toàn bộ phiếu mượn
// 4. Dùng computed `filteredBorrows` để lọc danh sách theo activeFilter
// 5. Viết hàm handleApprove(borrowId):
//    - Gọi borrowService.approveBorrowRequest(borrowId)
//    - Tải lại danh sách sau khi thành công
// 6. Viết hàm handleReturn(borrowId):
//    - Gọi borrowService.returnBook(borrowId)
//    - Tải lại danh sách sau khi thành công
// 7. Viết hàm handleReject(borrowId):
//    - Gọi borrowService.cancelBorrowRequest(borrowId)
//    - Tải lại danh sách sau khi thành công
</script>

<style scoped>
/* TODO: Tự viết CSS của bạn tại đây */
</style>
