import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  ShieldCheck,
  Menu,
  Mail,
  MessageSquare,
  CalendarCheck,
  CheckCheck,
  RefreshCw,
  X,
  ExternalLink,
} from 'lucide-react';
import { useAdminNotifications, useMarkNotificationsRead } from '../../hooks/useDashboard';
import { motion, AnimatePresence } from 'framer-motion';

export const AdminHeader = ({ title = 'Dashboard Overview', description, onToggleMobileSidebar }) => {
  const navigate = useNavigate();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const popoverRef = useRef(null);

  const { data: notificationData, refetch, isFetching } = useAdminNotifications();
  const markReadMutation = useMarkNotificationsRead();

  const notifications = notificationData?.notifications || [];
  const unreadCount = notificationData?.unreadCount || 0;

  // Close popover on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setPopoverOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAllRead = () => {
    markReadMutation.mutate(undefined);
  };

  const handleNotificationClick = (item) => {
    if (!item.read) {
      markReadMutation.mutate([item.id]);
    }
    setPopoverOpen(false);
    if (item.bookingId) {
      navigate('/admin/bookings');
    }
  };

  const getTimeAgo = (dateStr) => {
    if (!dateStr) return 'Just now';
    const diffMs = new Date() - new Date(dateStr);
    const diffMins = Math.floor(diffMs / (1000 * 60));
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  return (
    <header className="h-16 sm:h-20 bg-white border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      <div className="flex items-center gap-3">
        {/* Mobile Sidebar Hamburger Toggle */}
        <button
          onClick={onToggleMobileSidebar}
          className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 focus:outline-none"
          aria-label="Open Admin Menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-tight">{title}</h1>
          {description && <p className="text-[11px] sm:text-xs text-slate-500 hidden sm:block">{description}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 relative" ref={popoverRef}>
        {/* Offline Workflow Badge */}
        <div className="hidden sm:flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full border border-emerald-200 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Offline Mode</span>
        </div>

        {/* Interactive Notification Bell */}
        <button
          onClick={() => setPopoverOpen(!popoverOpen)}
          className={`p-2 rounded-xl relative transition-all cursor-pointer ${
            popoverOpen
              ? 'bg-teal-50 text-teal-700 font-bold'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title="Admin Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full bg-rose-500 text-white font-extrabold text-[10px] ring-2 ring-white min-w-[18px] text-center shadow-xs">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* Notifications Popover Dropdown */}
        <AnimatePresence>
          {popoverOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-14 w-80 sm:w-96 bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden z-50 flex flex-col max-h-[80vh]"
            >
              {/* Header */}
              <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-teal-400" />
                  <h3 className="font-bold text-sm">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-extrabold text-[10px] border border-teal-500/30">
                      {unreadCount} new
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => refetch()}
                    className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
                    title="Refresh Notifications"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
                  </button>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="p-1 text-xs text-teal-400 hover:text-teal-300 font-bold flex items-center gap-1"
                      title="Mark all as read"
                    >
                      <CheckCheck className="w-3.5 h-3.5" /> Read All
                    </button>
                  )}
                  <button
                    onClick={() => setPopoverOpen(false)}
                    className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Notification List */}
              <div className="flex-1 overflow-y-auto divide-y divide-slate-100 max-h-96">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center space-y-2">
                    <Bell className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="text-xs font-bold text-slate-600">No Notifications</p>
                    <p className="text-[11px] text-slate-400">All customer booking and notification logs will appear here.</p>
                  </div>
                ) : (
                  notifications.map((item) => {
                    const isUnread = !item.read;

                    return (
                      <div
                        key={item.id}
                        onClick={() => handleNotificationClick(item)}
                        className={`p-3.5 flex items-start gap-3 hover:bg-slate-50 transition-colors cursor-pointer ${
                          isUnread ? 'bg-teal-50/40 border-l-4 border-teal-500' : ''
                        }`}
                      >
                        {/* Icon */}
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                            item.type === 'BOOKING'
                              ? 'bg-teal-100 text-teal-700'
                              : item.type === 'EMAIL'
                              ? 'bg-sky-100 text-sky-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {item.type === 'BOOKING' ? (
                            <CalendarCheck className="w-4 h-4" />
                          ) : item.type === 'EMAIL' ? (
                            <Mail className="w-4 h-4" />
                          ) : (
                            <MessageSquare className="w-4 h-4" />
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex-1 overflow-hidden">
                          <div className="flex items-center justify-between gap-1">
                            <h4 className={`text-xs font-bold truncate ${isUnread ? 'text-slate-900' : 'text-slate-700'}`}>
                              {item.title}
                            </h4>
                            <span className="text-[10px] text-slate-400 shrink-0">{getTimeAgo(item.createdAt)}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-relaxed">{item.message}</p>

                          <div className="mt-1.5 flex items-center justify-between">
                            <span
                              className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md ${
                                item.status === 'SENT' || item.status === 'Confirmed' || item.status === 'Paid'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : item.status === 'SIMULATED'
                                  ? 'bg-sky-100 text-sky-800'
                                  : item.status === 'FAILED'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {item.status}
                            </span>
                            <span className="text-[10px] text-teal-600 font-bold hover:underline flex items-center gap-0.5">
                              View Order <ExternalLink className="w-2.5 h-2.5" />
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-center">
                <button
                  onClick={() => {
                    setPopoverOpen(false);
                    navigate('/admin/bookings');
                  }}
                  className="text-xs font-bold text-teal-600 hover:text-teal-700"
                >
                  View All Bookings & Ledger →
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};
