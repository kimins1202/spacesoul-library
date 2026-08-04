import { api } from './api';

export const userService = {
  // Lấy hồ sơ cá nhân của độc giả hoặc quản trị viên
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
};

