// Centralized API contracts definition file for future REST backend

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/admin/login',
    LOGOUT: '/admin/logout',
    ME: '/admin/me',
  },
  SERVICES: {
    LIST: '/services',
    DETAILS: (id) => `/services/${id}`,
    ADMIN_LIST: '/admin/services',
    CREATE: '/admin/services',
    UPDATE: (id) => `/admin/services/${id}`,
    DELETE: (id) => `/admin/services/${id}`,
  },
  BOOKINGS: {
    CREATE: '/bookings',
    GET_BY_ID: (id) => `/bookings/${id}`,
    AVAILABILITY: '/bookings/availability',
    ADMIN_LIST: '/admin/bookings',
    ADMIN_DETAILS: (id) => `/admin/bookings/${id}`,
    UPDATE_STATUS: (id) => `/admin/bookings/${id}/status`,
    UPDATE_BOOKING: (id) => `/admin/bookings/${id}`,
    ADD_NOTE: (id) => `/admin/bookings/${id}/notes`,
    DELETE_BOOKING: (id) => `/admin/bookings/${id}`,
  },
  PAYMENTS: {
    CREATE_ORDER: '/payments/create-order',
    VERIFY: '/payments/verify',
    STATUS: (id) => `/payments/${id}`,
  },
  DASHBOARD: {
    STATS: '/admin/dashboard/stats',
    RECENT_BOOKINGS: '/admin/dashboard/recent-bookings',
    NOTIFICATIONS: '/admin/dashboard/notifications',
    MARK_NOTIFICATIONS_READ: '/admin/dashboard/notifications/mark-read',
  },
};
