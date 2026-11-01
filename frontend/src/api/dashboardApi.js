import { ENDPOINTS } from './endpoints';
import { axiosInstance } from './axiosInstance';
import { getMockDashboardStats } from '../mock/dashboard';
import { MOCK_BOOKINGS } from '../mock/bookings';

const MOCK_ENABLED = false;
const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

export const dashboardApi = {
  getStats: async () => {
    if (MOCK_ENABLED) {
      await delay(400);
      return getMockDashboardStats();
    }
    const response = await axiosInstance.get(ENDPOINTS.DASHBOARD.STATS);
    return response.data;
  },

  getRecentBookings: async (limit = 5) => {
    if (MOCK_ENABLED) {
      await delay(300);
      return MOCK_BOOKINGS.slice(0, limit);
    }
    const response = await axiosInstance.get(ENDPOINTS.DASHBOARD.RECENT_BOOKINGS, { params: { limit } });
    return response.data;
  },

  getNotifications: async (limit = 15) => {
    if (MOCK_ENABLED) {
      await delay(200);
      return { unreadCount: 2, notifications: [] };
    }
    const response = await axiosInstance.get(ENDPOINTS.DASHBOARD.NOTIFICATIONS, { params: { limit } });
    return response.data;
  },

  markNotificationsRead: async (notificationIds) => {
    if (MOCK_ENABLED) {
      await delay(200);
      return { success: true };
    }
    const response = await axiosInstance.patch(ENDPOINTS.DASHBOARD.MARK_NOTIFICATIONS_READ, { notificationIds });
    return response.data;
  },
};
