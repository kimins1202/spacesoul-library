import { api } from './api';

export const borrowService = {
  // Gửi yêu cầu mượn sách (User)
  async createBorrowRequest(bookId, durationDays = 14) {
    // Tính toán ngày trả dự kiến
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + durationDays);
    
    return await api.post('/borrows', {
      bookId,
      dueDate: dueDate.toISOString()
    });
  },

  // Lấy lịch sử mượn cá nhân (User)
  async getMyBorrows() {
    return await api.get('/borrows/myborrows');
  },

  // Hủy yêu cầu mượn (User hoặc Admin từ chối)
  async cancelBorrowRequest(id) {
    return await api.put(`/borrows/${id}/cancel`, {});
  },

  // Lấy toàn bộ yêu cầu mượn trả (Admin)
  async getAllBorrows() {
    return await api.get('/borrows');
  },

  // Phê duyệt yêu cầu mượn sách (Admin)
  async approveBorrowRequest(id) {
    return await api.put(`/borrows/${id}/approve`, {});
  },

  // Yêu cầu trả sách (User)
  async requestReturnBook(id) {
    return await api.put(`/borrows/${id}/return`, {});
  },

  // Xác nhận đã nhận lại sách trả (Admin)
  async confirmReturnBook(id) {
    return await api.put(`/borrows/${id}/confirm-return`, {});
  }
};
