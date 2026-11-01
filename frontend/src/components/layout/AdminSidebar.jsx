import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarCheck2,
  CalendarDays,
  Settings,
  LogOut,
  Sparkles,
  Home,
  X,
} from 'lucide-react';
import { useAdminAuth } from '../../store/adminAuthStore';
import { useAdminLogout } from '../../hooks/useAdmin';
import { motion, AnimatePresence } from 'framer-motion';

export const AdminSidebar = ({ mobileOpen, setMobileOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { adminUser, logoutAdmin } = useAdminAuth();
  const logoutMutation = useAdminLogout();

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Services Catalog', path: '/admin/services', icon: Sparkles },
    { name: 'Bookings Management', path: '/admin/bookings', icon: CalendarCheck2 },
    { name: 'Calendar Schedule', path: '/admin/calendar', icon: CalendarDays },
    { name: 'Settings & Business', path: '/admin/settings', icon: Settings },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        logoutAdmin();
        navigate('/admin/login', { replace: true });
      },
    });
  };

  const renderSidebarContent = () => (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300">
      {/* Brand Header */}
      <div className="h-20 px-6 flex items-center justify-between border-b border-slate-800 shrink-0">
        <Link to="/admin/dashboard" onClick={() => setMobileOpen && setMobileOpen(false)} className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-teal-500 flex items-center justify-center text-slate-950 font-bold shadow-md">
            <Sparkles className="w-5 h-5 fill-current text-slate-950" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-extrabold text-white tracking-tight">
              Sagarika<span className="text-teal-400">Admin</span>
            </span>
            <span className="text-[10px] text-teal-400 font-bold uppercase tracking-wider">
              Control Panel
            </span>
          </div>
        </Link>

        {/* Mobile Close Button */}
        {setMobileOpen && (
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
            aria-label="Close Mobile Sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Admin User Info */}
      <div className="px-6 py-4 border-b border-slate-800/60 bg-slate-950/40 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-teal-600/30 text-teal-300 border border-teal-500/30 flex items-center justify-center font-bold text-sm">
            {adminUser?.name ? adminUser.name.charAt(0) : 'S'}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-white truncate">{adminUser?.name || 'Sagarika Admin'}</p>
            <p className="text-xs text-slate-400 truncate">{adminUser?.email || 'admin@sagrika.com'}</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
          Management
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setMobileOpen && setMobileOpen(false)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                active
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-slate-400'}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-slate-800 space-y-2 shrink-0">
        <Link
          to="/"
          onClick={() => setMobileOpen && setMobileOpen(false)}
          className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>View Public Website</span>
        </Link>
        <button
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>{logoutMutation.isPending ? 'Logging out...' : 'Logout Admin'}</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Fixed 64 width on desktop) */}
      <aside className="hidden md:flex w-64 bg-slate-900 border-r border-slate-800 shrink-0 min-h-screen flex-col">
        {renderSidebarContent()}
      </aside>

      {/* Mobile Drawer (Slide-over overlay on screens < md) */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
            />

            {/* Sidebar drawer content */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-72 max-w-[85vw] bg-slate-900 z-50 h-full flex flex-col shadow-2xl"
            >
              {renderSidebarContent()}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
