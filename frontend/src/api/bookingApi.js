import { ENDPOINTS } from './endpoints';
import { axiosInstance } from './axiosInstance';
import { MOCK_BOOKINGS } from '../mock/bookings';
import { getAvailableDates } from '../mock/availability';
import { generateBookingId } from '../utils/formatters';

const MOCK_ENABLED = false;
const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

// Keep local in-memory array during session so admin actions persist across route changes
let currentBookings = [...MOCK_BOOKINGS];

export const bookingApi = {
  createBooking: async (bookingData) => {
    if (MOCK_ENABLED) {
      await delay(700);
      const newBooking = {
        id: bookingData.id || generateBookingId(),
        ...bookingData,
        status: bookingData.status || 'Pending',
        payment: {
          ...bookingData.payment,
          status: bookingData.payment?.status || 'Pending',
        },
        createdAt: new Date().toISOString(),
      };
      currentBookings.unshift(newBooking);
      return newBooking;
    }
    const response = await axiosInstance.post(ENDPOINTS.BOOKINGS.CREATE, bookingData);
    return response.data;
  },

  getBookingById: async (id) => {
    if (MOCK_ENABLED) {
      await delay(300);
      const booking = currentBookings.find((b) => b.id === id);
      if (!booking) {
        throw new Error(`Booking #${id} not found.`);
      }
      return booking;
    }
    const response = await axiosInstance.get(ENDPOINTS.BOOKINGS.GET_BY_ID(id));
    return response.data;
  },

  getBookings: async (params = {}) => {
    if (MOCK_ENABLED) {
      await delay(300);
      let result = [...currentBookings];

      const { search, status, paymentStatus, serviceId, sortBy = 'newest' } = params;

      // Filter by Search (ID, customer name, phone, email)
      if (search) {
        const query = search.toLowerCase().trim();
        result = result.filter(
          (b) =>
            b.id.toLowerCase().includes(query) ||
            b.customer?.fullName?.toLowerCase().includes(query) ||
            b.customer?.email?.toLowerCase().includes(query) ||
            b.customer?.phone?.includes(query)
        );
      }

      // Filter by Booking Status
      if (status && status !== 'ALL') {
        result = result.filter((b) => b.status.toLowerCase() === status.toLowerCase());
      }

      // Filter by Payment Status
      if (paymentStatus && paymentStatus !== 'ALL') {
        result = result.filter((b) => b.payment?.status?.toLowerCase().includes(paymentStatus.toLowerCase()));
      }

      // Filter by Service
      if (serviceId && serviceId !== 'ALL') {
        result = result.filter((b) => b.service?.id === serviceId);
      }

      // Sorting
      if (sortBy === 'newest') {
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else if (sortBy === 'oldest') {
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      } else if (sortBy === 'highest_amount') {
        result.sort((a, b) => (b.pricing?.total || 0) - (a.pricing?.total || 0));
      } else if (sortBy === 'lowest_amount') {
        result.sort((a, b) => (a.pricing?.total || 0) - (b.pricing?.total || 0));
      }

      return result;
    }
    const response = await axiosInstance.get(ENDPOINTS.BOOKINGS.ADMIN_LIST, { params });
    return response.data;
  },

  updateBookingStatus: async (id, status, assignedCleaner = null) => {
    if (MOCK_ENABLED) {
      await delay(300);
      const index = currentBookings.findIndex((b) => b.id === id);
      if (index === -1) throw new Error('Booking not found');
      currentBookings[index].status = status;
      if (assignedCleaner) {
        currentBookings[index].assignedCleaner = assignedCleaner;
      }
      return currentBookings[index];
    }
    const response = await axiosInstance.patch(ENDPOINTS.BOOKINGS.UPDATE_STATUS(id), {
      status,
      assignedCleaner,
    });
    return response.data;
  },

  trackBooking: async (query) => {
    if (MOCK_ENABLED) {
      await delay(300);
      const clean = query.trim().toLowerCase();
      const b = currentBookings.find(
        (item) =>
          item.id.toLowerCase() === clean ||
          item.customer?.phone?.includes(clean)
      );
      if (!b) throw new Error('Booking not found');
      return { success: true, count: 1, booking: b, bookings: [b] };
    }
    const response = await axiosInstance.get('/bookings/track', {
      params: { query },
    });
    return response.data;
  },

  getCalendarBookings: async (params = {}) => {
    if (MOCK_ENABLED) {
      await delay(300);
      return currentBookings;
    }
    const response = await axiosInstance.get('/admin/bookings/calendar', {
      params,
    });
    return response.data;
  },

  updatePaymentStatus: async (id, paymentStatus, newBookingStatus) => {
    if (MOCK_ENABLED) {
      await delay(400);
      const index = currentBookings.findIndex((b) => b.id === id);
      if (index === -1) throw new Error('Booking not found');

      currentBookings[index].payment = {
        ...currentBookings[index].payment,
        status: paymentStatus,
        paidAt: paymentStatus === 'Paid' ? new Date().toISOString() : currentBookings[index].payment?.paidAt,
      };

      if (newBookingStatus) {
        currentBookings[index].status = newBookingStatus;
      } else if (paymentStatus === 'Paid' && currentBookings[index].status === 'Pending') {
        currentBookings[index].status = 'Confirmed';
      }

      return currentBookings[index];
    }
    const response = await axiosInstance.patch(`${ENDPOINTS.BOOKINGS.UPDATE_STATUS(id)}/payment`, {
      paymentStatus,
      bookingStatus: newBookingStatus,
    });
    return response.data;
  },

  addBookingNote: async (id, noteText) => {
    if (MOCK_ENABLED) {
      await delay(300);
      const index = currentBookings.findIndex((b) => b.id === id);
      if (index === -1) throw new Error('Booking not found');
      const timestamp = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
      const formattedNote = currentBookings[index].notes
        ? `${currentBookings[index].notes}\n[${timestamp}] ${noteText}`
        : `[${timestamp}] ${noteText}`;
      currentBookings[index].notes = formattedNote;
      return currentBookings[index];
    }
    const response = await axiosInstance.post(ENDPOINTS.BOOKINGS.ADD_NOTE(id), { noteText });
    return response.data;
  },

  getAvailability: async () => {
    if (MOCK_ENABLED) {
      await delay(200);
      return getAvailableDates(14);
    }
    const response = await axiosInstance.get(ENDPOINTS.BOOKINGS.AVAILABILITY);
    return response.data;
  },

  deleteBooking: async (id) => {
    if (MOCK_ENABLED) {
      await delay(400);
      currentBookings = currentBookings.filter((b) => b.id !== id);
      return { success: true, id };
    }
    const response = await axiosInstance.delete(ENDPOINTS.BOOKINGS.DELETE_BOOKING(id));
    return response.data;
  },
};
