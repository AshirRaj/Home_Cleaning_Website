import { ENDPOINTS } from './endpoints';
import { axiosInstance } from './axiosInstance';

const MOCK_ENABLED = false;

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

export const authApi = {
  login: async (credentials) => {
    if (MOCK_ENABLED) {
      await delay(400);
      const emailLower = credentials.email?.toLowerCase().trim();
      const storedPassword = localStorage.getItem('sparkle_admin_password') || 'admin123';
      
      if (
        (emailLower === 'admin@sagrika.com' ||
          emailLower === 'admin@sagarika.com' ||
          emailLower === 'admin@sparkleclean.com') &&
        credentials.password === storedPassword
      ) {
        const token = 'mock_jwt_token_admin_98765';
        const user = {
          id: 'admin-01',
          name: 'Sagarika Admin',
          email: 'admin@sagrika.com',
          role: 'ADMIN',
        };
        localStorage.setItem('sparkle_admin_token', token);
        localStorage.setItem('sparkle_admin_user', JSON.stringify(user));
        return { success: true, token, user };
      } else {
        throw new Error('Invalid email or password. Default is admin@sagrika.com / admin123');
      }
    }
    const response = await axiosInstance.post(ENDPOINTS.AUTH.LOGIN, credentials);
    return response.data;
  },

  logout: async () => {
    if (MOCK_ENABLED) {
      await delay(300);
      localStorage.removeItem('sparkle_admin_token');
      localStorage.removeItem('sparkle_admin_user');
      return { success: true, message: 'Logged out successfully' };
    }
    const response = await axiosInstance.post(ENDPOINTS.AUTH.LOGOUT);
    return response.data;
  },

  getCurrentAdmin: async () => {
    if (MOCK_ENABLED) {
      await delay(200);
      const userStr = localStorage.getItem('sparkle_admin_user');
      const token = localStorage.getItem('sparkle_admin_token');
      if (userStr && token) {
        return { success: true, user: JSON.parse(userStr) };
      }
      throw new Error('Unauthenticated admin session');
    }
    const response = await axiosInstance.get(ENDPOINTS.AUTH.ME);
    return response.data;
  },

  changePassword: async ({ oldPassword, newPassword, email }) => {
    if (MOCK_ENABLED) {
      await delay(300);
      localStorage.setItem('sparkle_admin_password', newPassword);
      return { success: true, message: 'Password updated successfully' };
    }
    const response = await axiosInstance.post('/admin/change-password', {
      oldPassword,
      newPassword,
      email,
    });
    return response.data;
  },
};
