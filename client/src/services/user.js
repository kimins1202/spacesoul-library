import { api } from './api';

export const userService = {
  // Lấy hồ sơ cá nhân của mình (dùng cho cả Reader lẫn Employee)
  async getProfile() {
    return await api.get('/users/profile');
  },

  // Cập nhật hồ sơ cá nhân
  async updateProfile(profileData) {
    const data = await api.put('/users/profile', profileData);
    // Cập nhật lại thông tin user trong localStorage nếu thành công
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  },

  // ===== ADMIN: READER (ĐỘC GIẢ) =====

  // Lấy danh sách tất cả Độc giả
  async getAllReaders() {
    return await api.get('/users/readers');
  },

  // Xóa Độc giả
  async deleteReader(id) {
    return await api.delete(`/users/readers/${id}`);
  },

  // Khóa / Mở khóa tài khoản Độc giả
  async toggleReaderStatus(id) {
    return await api.put(`/users/readers/${id}/toggle-status`);
  },

  // ===== ADMIN: EMPLOYEE (NHÂN VIÊN) =====

  // Lấy danh sách tất cả Nhân viên
  async getAllEmployees() {
    return await api.get('/users/employees');
  },

  // Tạo Nhân viên mới
  async createEmployee(employeeData) {
    return await api.post('/users/employees', employeeData);
  },

  // Xóa Nhân viên
  async deleteEmployee(id) {
    return await api.delete(`/users/employees/${id}`);
  },
};

