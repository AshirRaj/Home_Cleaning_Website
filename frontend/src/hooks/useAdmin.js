import { useMutation, useQuery } from '@tanstack/react-query';
import { authApi } from '../api/authApi';
import { useAdminAuth } from '../store/adminAuthStore';

export const useAdminLogin = () => {
  const { loginAdmin } = useAdminAuth();
  return useMutation({
    mutationFn: (credentials) => authApi.login(credentials),
    onSuccess: (data) => {
      loginAdmin(data.user, data.token);
    },
  });
};

export const useAdminLogout = () => {
  const { logoutAdmin } = useAdminAuth();
  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      logoutAdmin();
    },
  });
};

export const useCurrentAdmin = () => {
  const { isAuthenticated } = useAdminAuth();
  return useQuery({
    queryKey: ['admin-me'],
    queryFn: () => authApi.getCurrentAdmin(),
    enabled: isAuthenticated,
  });
};
