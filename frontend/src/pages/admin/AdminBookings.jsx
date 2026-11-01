import { useState } from 'react';
import { useAdminBookings, useDeleteBooking } from '../../hooks/useBookings';
import { BookingFilters } from '../../components/admin/BookingFilters';
import { BookingTable } from '../../components/admin/BookingTable';
import { BookingDetailsModal } from '../../components/admin/BookingDetailsModal';
import { Skeleton } from '../../components/common/Skeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { RefreshCw, Trash2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Button } from '../../components/common/Button';

export const AdminBookings = () => {
  const [filters, setFilters] = useState({
    search: '',
    status: 'ALL',
    paymentStatus: 'ALL',
    serviceId: 'ALL',
    sortBy: 'newest',
  });

  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [deletingBooking, setDeletingBooking] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  const { data: bookings, isLoading, refetch } = useAdminBookings(filters);
  const deleteBookingMutation = useDeleteBooking();

  const selectedBooking = bookings?.find((b) => b.id === selectedBookingId);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      status: 'ALL',
      paymentStatus: 'ALL',
      serviceId: 'ALL',
      sortBy: 'newest',
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deletingBooking) return;
    try {
      await deleteBookingMutation.mutateAsync(deletingBooking.id);
      setFeedbackMessage({
        type: 'success',
        text: `Booking order #${deletingBooking.id} deleted successfully.`,
      });
      setDeletingBooking(null);
      setTimeout(() => setFeedbackMessage(null), 4000);
    } catch (err) {
      console.error('Failed to delete booking order:', err);
      setFeedbackMessage({
        type: 'error',
        text: err.response?.data?.message || err.message || 'Failed to delete booking order.',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Bookings Ledger</h2>
          <p className="text-xs text-slate-500">
            Total {bookings?.length || 0} customer service reservations
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" icon={RefreshCw} onClick={() => refetch()}>
            Refresh Ledger
          </Button>
        </div>
      </div>

      {/* Feedback Toast Notification */}
      {feedbackMessage && (
        <div
          className={`p-4 rounded-xl text-sm font-semibold flex items-center justify-between shadow-sm ${
            feedbackMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <span className="flex items-center gap-2">
            {feedbackMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-600" />
            )}
            {feedbackMessage.text}
          </span>
          <button
            onClick={() => setFeedbackMessage(null)}
            className="text-xs text-slate-500 hover:text-slate-900 font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Filter Component */}
      <BookingFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* Booking Table */}
      {isLoading ? (
        <Skeleton className="h-96 w-full rounded-2xl" />
      ) : bookings?.length === 0 ? (
        <EmptyState
          title="No bookings found"
          description="There are no bookings matching your current filter criteria."
          actionLabel="Reset Filters"
          onAction={handleResetFilters}
        />
      ) : (
        <BookingTable
          bookings={bookings}
          onViewBooking={(id) => setSelectedBookingId(id)}
          onDeleteBooking={(booking) => setDeletingBooking(booking)}
        />
      )}

      {/* Booking Details Modal */}
      <BookingDetailsModal
        isOpen={Boolean(selectedBookingId)}
        onClose={() => setSelectedBookingId(null)}
        booking={selectedBooking}
      />

      {/* Delete Booking Confirmation Modal */}
      {deletingBooking && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Delete Booking Order?</h3>
                <p className="text-xs text-slate-500 font-mono">Order #{deletingBooking.id}</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to permanently delete order <strong className="text-slate-900">#{deletingBooking.id}</strong> for customer <strong className="text-slate-900">{deletingBooking.customer?.fullName || 'Guest'}</strong>? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <Button variant="outline" onClick={() => setDeletingBooking(null)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleDeleteConfirm}
                isLoading={deleteBookingMutation.isPending}
              >
                Delete Permanently
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
