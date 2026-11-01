import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingApi } from '../api/bookingApi';

export const useAdminBookings = (filters = {}) => {
  return useQuery({
    queryKey: ['admin-bookings', filters],
    queryFn: () => bookingApi.getBookings(filters),
    keepPreviousData: true,
  });
};

export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, assignedCleaner }) =>
      bookingApi.updateBookingStatus(id, status, assignedCleaner),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['admin-calendar-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['booking', data.id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });
};

export const useCalendarBookings = (params = {}) => {
  return useQuery({
    queryKey: ['admin-calendar-bookings', params],
    queryFn: () => bookingApi.getCalendarBookings(params),
  });
};

export const useAddBookingNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, noteText }) => bookingApi.addBookingNote(id, noteText),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['booking', data.id] });
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
    },
  });
};

export const useDeleteBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => bookingApi.deleteBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });
};
