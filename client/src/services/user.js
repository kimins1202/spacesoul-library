import { api } from './api';

export const userService = {
  // Lấy hồ sơ cá nhân của mình
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

  // Lấy toàn bộ người dùng (Admin)
  async getAllUsers() {
    return await api.get('/users');
  },

  // Xóa người dùng (Admin)
  async deleteUser(id) {
    return await api.delete(`/users/${id}`);
  }
};
