// Base URL của Backend API (mặc định chạy ở port 5000)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Trợ giúp gửi request API chung dùng fetch API
 */
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(`${API_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    // Token cũ/hết hạn (thường xảy ra sau khi đổi JWT_SECRET): xóa phiên và yêu cầu đăng nhập lại.
    if (response.status === 401 && token && endpoint !== '/auth/login') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      const redirect = `${window.location.pathname}${window.location.search}`;
      window.location.assign(`/login?expired=1&redirect=${encodeURIComponent(redirect)}`);
    }
    throw new Error(data.message || 'Có lỗi xảy ra khi gọi API');
  }

  return data;
}

export const api = {
  get: (endpoint, options) => request(endpoint, { method: 'GET', ...options }),
  post: (endpoint, body, options) => request(endpoint, { method: 'POST', body, ...options }),
  put: (endpoint, body, options) => request(endpoint, { method: 'PUT', body, ...options }),
  delete: (endpoint, options) => request(endpoint, { method: 'DELETE', ...options }),
};
