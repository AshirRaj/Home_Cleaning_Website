import { BookingStatusBadge, PaymentStatusBadge } from './BookingStatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Eye, CheckCircle2, Trash2 } from 'lucide-react';
import { Button } from '../common/Button';
import { useUpdatePaymentStatus } from '../../hooks/useBooking';

export const BookingTable = ({ bookings = [], onViewBooking, onDeleteBooking }) => {
  const updatePaymentMutation = useUpdatePaymentStatus();

  if (bookings.length === 0) {
    return null;
  }

  const handleConfirmPaymentQuick = (e, bookingId) => {
    e.stopPropagation();
    updatePaymentMutation.mutate({
      id: bookingId,
      paymentStatus: 'Paid',
      bookingStatus: 'Confirmed',
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-bold uppercase text-slate-500 tracking-wider">
              <th className="py-3.5 px-4">Booking ID</th>
              <th className="py-3.5 px-4">Customer</th>
              <th className="py-3.5 px-4">Service</th>
              <th className="py-3.5 px-4">Schedule</th>
              <th className="py-3.5 px-4">Amount</th>
              <th className="py-3.5 px-4">Payment</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {bookings.map((b) => {
              const isPaymentPending =
                b.payment?.status?.toLowerCase().includes('pending') || b.payment?.status !== 'Paid';

              return (
                <tr key={b.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-4 font-mono font-bold text-slate-900">{b.id}</td>
                  <td className="py-4 px-4">
                    <p className="font-bold text-slate-900">{b.customer?.fullName || 'Guest Customer'}</p>
                    <p className="text-xs text-slate-400">{b.customer?.phone || b.address?.phone}</p>
                  </td>
                  <td className="py-4 px-4 font-medium text-slate-700">{b.service?.name}</td>
                  <td className="py-4 px-4">
                    <p className="text-xs font-semibold text-slate-800">{formatDate(b.schedule?.date)}</p>
                    <p className="text-[11px] text-teal-700 font-bold">{b.schedule?.timeSlot}</p>
                  </td>
                  <td className="py-4 px-4 font-extrabold text-slate-900">
                    {formatCurrency(b.pricing?.total)}
                  </td>
                  <td className="py-4 px-4">
                    <PaymentStatusBadge status={b.payment?.status} />
                  </td>
                  <td className="py-4 px-4">
                    <BookingStatusBadge status={b.status} />
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {isPaymentPending && (
                        <button
                          type="button"
                          onClick={(e) => handleConfirmPaymentQuick(e, b.id)}
                          disabled={updatePaymentMutation.isPending}
                          className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold flex items-center gap-1 shadow-xs transition-all cursor-pointer"
                          title="Confirm Payment & set status to Confirmed"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Mark Paid</span>
                        </button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        icon={Eye}
                        onClick={() => onViewBooking(b.id)}
                      >
                        View Details
                      </Button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteBooking && onDeleteBooking(b);
                        }}
                        className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 rounded-xl transition-colors cursor-pointer"
                        title="Delete Booking Order"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List View */}
      <div className="md:hidden divide-y divide-slate-100">
        {bookings.map((b) => {
          const isPaymentPending =
            b.payment?.status?.toLowerCase().includes('pending') || b.payment?.status !== 'Paid';

          return (
            <div key={b.id} className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-sm text-slate-900">{b.id}</span>
                <BookingStatusBadge status={b.status} />
              </div>

              <div>
                <p className="font-bold text-slate-900 text-base">{b.customer?.fullName}</p>
                <p className="text-xs text-slate-500">{b.service?.name}</p>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl">
                <div>
                  <span className="block text-slate-400">Schedule</span>
                  <span className="font-semibold">{formatDate(b.schedule?.date)}</span>
                </div>
                <div className="text-right">
                  <span className="block text-slate-400">Total</span>
                  <span className="font-extrabold text-teal-700">{formatCurrency(b.pricing?.total)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <PaymentStatusBadge status={b.payment?.status} />
                <div className="flex items-center gap-2">
                  {isPaymentPending && (
                    <button
                      type="button"
                      onClick={(e) => handleConfirmPaymentQuick(e, b.id)}
                      className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold"
                    >
                      Mark Paid
                    </button>
                  )}
                  <Button variant="outline" size="sm" icon={Eye} onClick={() => onViewBooking(b.id)}>
                    View Details
                  </Button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteBooking && onDeleteBooking(b);
                    }}
                    className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                    title="Delete Booking Order"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
