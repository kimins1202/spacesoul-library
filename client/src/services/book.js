import { api } from './api';

export const bookService = {
  // Lấy danh sách sách (hỗ trợ query tìm kiếm hoặc lọc thể loại)
  async getBooks(params = {}) {
    const queryStr = new URLSearchParams(params).toString();
    const endpoint = queryStr ? `/books?${queryStr}` : '/books';
    return await api.get(endpoint);
  },

  // Lấy chi tiết sách theo ID
  async getBookById(id) {
    return await api.get(`/books/${id}`);
  },

  // Tạo sách mới (Admin)
  async createBook(bookData) {
    return await api.post('/books', bookData);
  },

  // Cập nhật thông tin sách (Admin)
  async updateBook(id, bookData) {
    return await api.put(`/books/${id}`, bookData);
  },

  // Xóa sách (Admin)
  async deleteBook(id) {
    return await api.delete(`/books/${id}`);
  }
};
