import { Navigate, Outlet } from 'react-router-dom';
import { useAdminAuth } from '../store/adminAuthStore';

export const ProtectedAdminRoute = () => {
  const { isAuthenticated, isVerifying } = useAdminAuth();

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center gap-3">
        <div className="w-9 h-9 border-3 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs font-semibold text-slate-400">Verifying Admin Session...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};
