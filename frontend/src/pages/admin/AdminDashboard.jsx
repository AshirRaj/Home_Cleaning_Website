import { useState } from 'react';
import { useDashboardStats } from '../../hooks/useDashboard';
import { useAdminBookings } from '../../hooks/useBookings';
import { StatsCard } from '../../components/admin/StatsCard';
import { BookingTable } from '../../components/admin/BookingTable';
import { BookingDetailsModal } from '../../components/admin/BookingDetailsModal';
import { Button } from '../../components/common/Button';
import { Skeleton } from '../../components/common/Skeleton';
import { formatCurrency } from '../../utils/formatters';
import {
  CalendarCheck,
  Clock,
  CreditCard,
  CheckCircle,
  XCircle,
  TrendingUp,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminDashboard = () => {
  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useDashboardStats();
  const { data: recentBookings, isLoading: bookingsLoading, refetch: refetchBookings } = useAdminBookings({ limit: 5 });

  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const selectedBooking = recentBookings?.find((b) => b.id === selectedBookingId);

  const handleRefresh = () => {
    refetchStats();
    refetchBookings();
  };

  return (
    <div className="space-y-8">
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Operations Dashboard</h2>
          <p className="text-xs text-slate-500">Live offline booking monitoring & ledger</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" icon={RefreshCw} onClick={handleRefresh}>
            Refresh Data
          </Button>
          <Link to="/admin/bookings">
            <Button variant="primary" size="sm" icon={ArrowRight}>
              View All Bookings
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Overview Grid */}
      {statsLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <StatsCard
            title="Total Bookings"
            value={stats?.totalBookings || 0}
            icon={CalendarCheck}
            color="teal"
            subtitle="All-time customer requests"
          />
          <StatsCard
            title="Today's Bookings"
            value={stats?.todayBookings || 0}
            icon={Clock}
            color="sky"
            subtitle="Scheduled for today"
          />
          <StatsCard
            title="Pending Payments"
            value={stats?.pendingPayments || 0}
            icon={CreditCard}
            color="amber"
            subtitle="Awaiting customer transfer"
          />
          <StatsCard
            title="Paid Bookings"
            value={stats?.paidBookings || 0}
            icon={TrendingUp}
            color="emerald"
            subtitle={`Total: ${formatCurrency(stats?.totalRevenue || 0)}`}
          />
          <StatsCard
            title="Completed Bookings"
            value={stats?.completedBookings || 0}
            icon={CheckCircle}
            color="teal"
            subtitle="Successfully serviced"
          />
          <StatsCard
            title="Cancelled Bookings"
            value={stats?.cancelledBookings || 0}
            icon={XCircle}
            color="rose"
            subtitle="Order voided"
          />
        </div>
      )}

      {/* Recent Bookings Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">Recent Customer Bookings</h3>
          <Link to="/admin/bookings" className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1">
            View Complete Ledger →
          </Link>
        </div>

        {bookingsLoading ? (
          <Skeleton className="h-64 w-full rounded-2xl" />
        ) : (
          <BookingTable
            bookings={recentBookings || []}
            onViewBooking={(id) => setSelectedBookingId(id)}
          />
        )}
      </div>

      {/* Booking Details Modal */}
      <BookingDetailsModal
        isOpen={Boolean(selectedBookingId)}
        onClose={() => setSelectedBookingId(null)}
        booking={selectedBooking}
      />
    </div>
  );
};
