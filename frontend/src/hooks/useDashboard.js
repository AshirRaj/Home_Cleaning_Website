import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboardApi';

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardApi.getStats(),
    refetchInterval: 30000, // Auto-refresh stats every 30s
  });
};

export const useRecentBookings = (limit = 5) => {
  return useQuery({
    queryKey: ['recent-bookings', limit],
    queryFn: () => dashboardApi.getRecentBookings(limit),
  });
};

export const useAdminNotifications = (limit = 15) => {
  return useQuery({
    queryKey: ['admin-notifications', limit],
    queryFn: () => dashboardApi.getNotifications(limit),
    refetchInterval: 15000, // Auto-refetch notifications every 15s
  });
};

export const useMarkNotificationsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (notificationIds) => dashboardApi.markNotificationsRead(notificationIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-notifications'] });
    },
  });
};
