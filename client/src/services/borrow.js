import { api } from './api';

export const borrowService = {
  // Gửi yêu cầu mượn sách (User)
  async createBorrowRequest(bookId, quantity = 1, durationDays = 14) {
    // Tính toán ngày trả dự kiến
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + durationDays);
    
    return await api.post('/borrows', {
      bookId,
      quantity,
      dueDate: dueDate.toISOString()
    });
  },

  // Lấy lịch sử mượn cá nhân (User)
  async getMyBorrows() {
    return await api.get('/borrows/myborrows');
  },

  // Quản trị viên từ chối yêu cầu mượn
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

  // Trả sách trực tiếp (User)
  async requestBookReturn(id) {
    return await api.put(`/borrows/${id}/request-return`, {});
  },

  async confirmBookReturn(id) {
    return await api.put(`/borrows/${id}/confirm-return`, {});
  }
};
