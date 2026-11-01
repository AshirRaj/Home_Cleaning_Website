import { Navigate, Outlet } from 'react-router-dom';
import { useAdminAuth } from '../store/adminAuthStore';

export const ProtectedAdminRoute = () => {
  const { isAuthenticated } = useAdminAuth();

  // Read localStorage in case context state is syncing
  const token = localStorage.getItem('sparkle_admin_token');
  const userStr = localStorage.getItem('sparkle_admin_user');
  const hasLocalSession = Boolean(token && userStr);

  if (!isAuthenticated && !hasLocalSession) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};
