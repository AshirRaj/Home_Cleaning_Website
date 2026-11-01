import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useCalendarBookings, useUpdateBookingStatus } from '../../hooks/useBookings';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  User,
  Phone,
  MapPin,
  CheckCircle2,
  X,
  ExternalLink,
  UserCheck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STATUS_COLORS = {
  Pending: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-800',
    dot: 'bg-amber-500',
  },
  Confirmed: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-800',
    dot: 'bg-blue-500',
  },
  Assigned: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-800',
    dot: 'bg-purple-500',
  },
  'Cleaner on the Way': {
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    text: 'text-indigo-800',
    dot: 'bg-indigo-500',
  },
  'In Progress': {
    bg: 'bg-teal-50',
    border: 'border-teal-200',
    text: 'text-teal-800',
    dot: 'bg-teal-500',
  },
  Completed: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-800',
    dot: 'bg-emerald-500',
  },
  Cancelled: {
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    text: 'text-rose-800',
    dot: 'bg-rose-500',
  },
};

const ALL_STATUSES = [
  'Pending',
  'Confirmed',
  'Assigned',
  'Cleaner on the Way',
  'In Progress',
  'Completed',
  'Cancelled',
];

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const AdminCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [activeModalBooking, setActiveModalBooking] = useState(null);

  // Edit / Assignment State inside Modal
  const [editStatus, setEditStatus] = useState('');
  const [crewName, setCrewName] = useState('');
  const [crewPhone, setCrewPhone] = useState('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1; // 1-12

  // Fetch monthly bookings from API
  const { data: bookings = [], refetch } = useCalendarBookings({ month, year });
  const updateStatusMutation = useUpdateBookingStatus();

  // Navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, currentDate.getMonth() + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  // Filter bookings by status if needed
  const filteredBookings = useMemo(() => {
    if (selectedStatus === 'ALL') return bookings;
    return bookings.filter((b) => b.status === selectedStatus);
  }, [bookings, selectedStatus]);

  // Group bookings by date string (e.g., "YYYY-MM-DD")
  const bookingsByDate = useMemo(() => {
    const map = {};
    for (const b of filteredBookings) {
      const dateStr = b.schedule?.date;
      if (!dateStr) continue;
      if (!map[dateStr]) map[dateStr] = [];
      map[dateStr].push(b);
    }
    return map;
  }, [filteredBookings]);

  // Calendar Day Grid Computation
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(year, currentDate.getMonth(), 1).getDay();
    const totalDays = new Date(year, currentDate.getMonth() + 1, 0).getDate();
    const prevMonthDays = new Date(year, currentDate.getMonth(), 0).getDate();

    const days = [];

    // Previous month padding days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = prevMonthDays - i;
      const prevDate = new Date(year, currentDate.getMonth() - 1, dayNum);
      const dateStr = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}-${String(
        dayNum
      ).padStart(2, '0')}`;
      days.push({
        dayNum,
        dateStr,
        isCurrentMonth: false,
        bookings: bookingsByDate[dateStr] || [],
      });
    }

    // Current month days
    for (let i = 1; i <= totalDays; i++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({
        dayNum: i,
        dateStr,
        isCurrentMonth: true,
        bookings: bookingsByDate[dateStr] || [],
      });
    }

    // Next month padding days to complete 35 or 42 grid cells
    const remaining = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      const nextDate = new Date(year, currentDate.getMonth() + 1, i);
      const dateStr = `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, '0')}-${String(
        i
      ).padStart(2, '0')}`;
      days.push({
        dayNum: i,
        dateStr,
        isCurrentMonth: false,
        bookings: bookingsByDate[dateStr] || [],
      });
    }

    return days;
  }, [year, month, currentDate, bookingsByDate]);

  // Today check
  const todayStr = useMemo(() => {
    const t = new Date();
    return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
  }, []);

  // Summary Metrics
  const metrics = useMemo(() => {
    const total = bookings.length;
    const completed = bookings.filter((b) => b.status === 'Completed').length;
    const inProgress = bookings.filter((b) => b.status === 'In Progress' || b.status === 'Cleaner on the Way').length;
    const revenue = bookings
      .filter((b) => b.status !== 'Cancelled')
      .reduce((sum, b) => sum + (b.pricing?.total || 0), 0);
    return { total, completed, inProgress, revenue };
  }, [bookings]);

  // Open Quick Edit Modal
  const handleOpenModal = (booking) => {
    setActiveModalBooking(booking);
    setEditStatus(booking.status || 'Confirmed');
    setCrewName(booking.assignedCleaner?.name || 'Sagarika Operations Crew');
    setCrewPhone(booking.assignedCleaner?.phone || '+91 76810 45009');
    setSaveSuccessMsg('');
  };

  // Save Booking Status & Crew Assignment
  const handleSaveModalUpdates = async () => {
    if (!activeModalBooking) return;
    try {
      await updateStatusMutation.mutateAsync({
        id: activeModalBooking.id || activeModalBooking.bookingId,
        status: editStatus,
        assignedCleaner: {
          name: crewName,
          phone: crewPhone,
        },
      });
      setSaveSuccessMsg('Booking status & crew updated successfully!');
      setTimeout(() => {
        setSaveSuccessMsg('');
        setActiveModalBooking(null);
      }, 900);
      refetch();
    } catch {
      // Handled by react-query
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Monthly Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Bookings in {monthName}
          </span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{metrics.total}</span>
          <span className="text-[11px] text-teal-700 font-medium">Scheduled for this month</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Completed Services
          </span>
          <span className="text-2xl font-black text-emerald-700 mt-1 block">{metrics.completed}</span>
          <span className="text-[11px] text-slate-500 font-medium">Fully fulfilled</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Active / On The Way
          </span>
          <span className="text-2xl font-black text-indigo-700 mt-1 block">{metrics.inProgress}</span>
          <span className="text-[11px] text-slate-500 font-medium">In action right now</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Projected Month Revenue
          </span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">
            {formatCurrency(metrics.revenue)}
          </span>
          <span className="text-[11px] text-emerald-700 font-medium">Confirmed & Completed</span>
        </div>
      </div>

      {/* Calendar Control Toolbar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Month Navigator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg hover:bg-white text-slate-700 transition-colors cursor-pointer"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleToday}
              className="px-3 py-1 text-xs font-bold text-slate-700 hover:bg-white rounded-lg transition-colors cursor-pointer"
            >
              Today
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg hover:bg-white text-slate-700 transition-colors cursor-pointer"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-teal-600" />
            <span>
              {monthName} {year}
            </span>
          </h2>
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1">
          <button
            type="button"
            onClick={() => setSelectedStatus('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedStatus === 'ALL'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({bookings.length})
          </button>
          {ALL_STATUSES.map((st) => {
            const count = bookings.filter((b) => b.status === st).length;
            const isSelected = selectedStatus === st;
            return (
              <button
                key={st}
                type="button"
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st} {count > 0 && `(${count})`}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Calendar Grid */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Days of Week Header */}
        <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 text-center py-3 text-xs font-bold text-slate-600 uppercase tracking-wider">
          {WEEKDAYS.map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>

        {/* Calendar Cells */}
        <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-100 min-h-[600px]">
          {calendarDays.map((day, idx) => {
            const isToday = day.dateStr === todayStr;
            const hasBookings = day.bookings.length > 0;

            return (
              <div
                key={idx}
                className={`min-h-[110px] sm:min-h-[130px] p-1.5 sm:p-2 flex flex-col transition-colors ${
                  !day.isCurrentMonth
                    ? 'bg-slate-50/60 opacity-40'
                    : isToday
                    ? 'bg-teal-50/40'
                    : 'hover:bg-slate-50/60'
                }`}
              >
                {/* Day Header */}
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      isToday
                        ? 'bg-teal-600 text-white shadow-xs'
                        : day.isCurrentMonth
                        ? 'text-slate-800'
                        : 'text-slate-400'
                    }`}
                  >
                    {day.dayNum}
                  </span>

                  {hasBookings && (
                    <span className="text-[10px] font-bold text-teal-700 bg-teal-100 px-1.5 py-0.2 rounded-full">
                      {day.bookings.length} {day.bookings.length === 1 ? 'task' : 'tasks'}
                    </span>
                  )}
                </div>

                {/* Day Bookings List */}
                <div className="space-y-1 overflow-y-auto max-h-[100px] scrollbar-none flex-1">
                  {day.bookings.slice(0, 3).map((b) => {
                    const st = STATUS_COLORS[b.status] || STATUS_COLORS.Confirmed;
                    return (
                      <button
                        key={b.id || b.bookingId}
                        type="button"
                        onClick={() => handleOpenModal(b)}
                        className={`w-full text-left p-1 sm:p-1.5 rounded-lg border text-[11px] leading-tight block transition-all hover:scale-[1.02] cursor-pointer shadow-2xs ${st.bg} ${st.border} ${st.text}`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-bold truncate max-w-[90px]">
                            {b.customer?.fullName?.split(' ')[0] || 'Client'}
                          </span>
                          <span className="text-[9px] opacity-80 shrink-0 font-mono">
                            {b.schedule?.timeSlot?.split('-')[0]?.trim()}
                          </span>
                        </div>
                        <span className="block text-[10px] opacity-75 truncate mt-0.5">
                          {b.service?.name?.slice(0, 16)}
                        </span>
                      </button>
                    );
                  })}

                  {day.bookings.length > 3 && (
                    <span className="text-[10px] text-slate-400 font-semibold text-center block pt-0.5">
                      +{day.bookings.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* QUICK BOOKING ACTION MODAL */}
      <AnimatePresence>
        {activeModalBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-md">
                      #{activeModalBooking.bookingId || activeModalBooking.id}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {formatDate(activeModalBooking.schedule?.date)} • Slot: {activeModalBooking.schedule?.timeSlot}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mt-1">
                    {activeModalBooking.service?.name || 'Home Cleaning'}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveModalBooking(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-5">
                {saveSuccessMsg && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{saveSuccessMsg}</span>
                  </div>
                )}

                {/* Customer Details */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <User className="w-4 h-4 text-teal-600" /> {activeModalBooking.customer?.fullName}
                    </span>
                    <span className="font-mono text-slate-700">
                      Fee: {formatCurrency(activeModalBooking.pricing?.total || 0)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-slate-600">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" /> {activeModalBooking.customer?.phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {activeModalBooking.address?.city}
                    </span>
                  </div>
                </div>

                {/* Status Updater */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 block">Update Service Status:</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {ALL_STATUSES.map((st) => {
                      const isSelected = editStatus === st;
                      const colors = STATUS_COLORS[st];
                      return (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setEditStatus(st)}
                          className={`p-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                            isSelected
                              ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                              : `${colors.bg} ${colors.text} ${colors.border} hover:opacity-90`
                          }`}
                        >
                          <span className={`w-2 h-2 rounded-full ${colors.dot}`} />
                          <span className="truncate">{st}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Assigned Crew Assignment */}
                <div className="space-y-3 pt-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-teal-600" /> Assign Cleaner Crew:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      label="Crew Name / Team Lead"
                      value={crewName}
                      onChange={(e) => setCrewName(e.target.value)}
                      placeholder="e.g. Blue Team - Ravi"
                    />
                    <Input
                      label="Crew Contact Number"
                      value={crewPhone}
                      onChange={(e) => setCrewPhone(e.target.value)}
                      placeholder="+91 76810 45009"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
                <Link
                  to={`/admin/bookings/${activeModalBooking.id || activeModalBooking.bookingId}`}
                  className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
                >
                  Full Specification <ExternalLink className="w-3.5 h-3.5" />
                </Link>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveModalBooking(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={handleSaveModalUpdates}
                    isLoading={updateStatusMutation.isPending}
                    className="font-bold shadow-md shadow-teal-600/20"
                  >
                    Save Changes ✓
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
