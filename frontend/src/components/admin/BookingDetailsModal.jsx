import { useState } from 'react';
import { Modal } from '../common/Modal';
import { BookingStatusBadge, PaymentStatusBadge } from './BookingStatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Button } from '../common/Button';
import { useUpdateBookingStatus, useUpdatePaymentStatus, useAddBookingNote } from '../../hooks/useBooking';
import {
  User,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  MessageSquare,
  FileText,
  Check,
  Send,
  Sparkles,
  Banknote,
  CheckCircle2,
} from 'lucide-react';

export const BookingDetailsModal = ({ isOpen, onClose, booking }) => {
  const [newStatus, setNewStatus] = useState('');
  const [paymentStatusState, setPaymentStatusState] = useState('');
  const [noteText, setNoteText] = useState('');
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  const updateStatusMutation = useUpdateBookingStatus();
  const updatePaymentMutation = useUpdatePaymentStatus();
  const addNoteMutation = useAddBookingNote();

  if (!booking) return null;

  const currentStatus = newStatus || booking.status;
  const currentPaymentStatus = paymentStatusState || booking.payment?.status || 'Pending';

  const handleStatusUpdate = (status) => {
    setNewStatus(status);
    setActionSuccessMsg('');
    updateStatusMutation.mutate(
      { id: booking.id, status },
      {
        onSuccess: () => {
          setActionSuccessMsg(`Booking status updated to "${status}"`);
        },
      }
    );
  };

  const handlePaymentConfirm = (payStatus, bookStatus = 'Confirmed') => {
    setPaymentStatusState(payStatus);
    if (bookStatus) setNewStatus(bookStatus);
    setActionSuccessMsg('');

    updatePaymentMutation.mutate(
      { id: booking.id, paymentStatus: payStatus, bookingStatus: bookStatus },
      {
        onSuccess: () => {
          setActionSuccessMsg(`Payment confirmed as "${payStatus}" & Booking status updated to "${bookStatus}"`);
        },
      }
    );
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    addNoteMutation.mutate(
      { id: booking.id, noteText },
      {
        onSuccess: () => setNoteText(''),
      }
    );
  };

  const statuses = [
    'Pending',
    'Confirmed',
    'Assigned',
    'Cleaner on the Way',
    'In Progress',
    'Completed',
    'Cancelled',
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Booking Specs #${booking.id}`} maxWidth="max-w-4xl">
      <div className="space-y-6 text-slate-800">
        {/* Toast Notification */}
        {actionSuccessMsg && (
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-900 p-3 rounded-xl text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionSuccessMsg}</span>
          </div>
        )}

        {/* Status Action Banner */}
        <div className="bg-slate-900 text-white p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-xs uppercase font-bold text-teal-400 tracking-wider">
                Booking Status
              </span>
              <BookingStatusBadge status={currentStatus} />
              <PaymentStatusBadge status={currentPaymentStatus} />
            </div>
            <p className="text-xs text-slate-400">
              Created on {new Date(booking.createdAt).toLocaleString('en-IN')}
            </p>
          </div>

          {/* Quick Status Setter */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-semibold text-slate-300 mr-1">Change Status:</span>
            {statuses.map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => handleStatusUpdate(st)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  currentStatus === st
                    ? 'bg-teal-500 text-slate-950 font-extrabold shadow-sm'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Dedicated Admin Payment Confirmation Box */}
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-emerald-950 font-bold text-sm">
              <Banknote className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Admin Payment Status Management</span>
            </div>
            <p className="text-xs text-emerald-800">
              Current Payment: <strong className="font-extrabold">{currentPaymentStatus}</strong> ({formatCurrency(booking.pricing?.total)})
            </p>
          </div>

          <div className="flex items-center gap-2">
            {currentPaymentStatus !== 'Paid' ? (
              <Button
                variant="primary"
                size="sm"
                icon={Check}
                isLoading={updatePaymentMutation.isPending}
                onClick={() => handlePaymentConfirm('Paid', 'Confirmed')}
                className="bg-emerald-600 hover:bg-emerald-700 border-emerald-600 text-white font-extrabold shadow-md"
              >
                Confirm Payment & Mark Paid ✓
              </Button>
            ) : (
              <button
                type="button"
                onClick={() => handlePaymentConfirm('Pending', 'Pending')}
                className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Mark Pending Again
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer & Location Box */}
          <div className="space-y-4">
            {/* Customer Details */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <User className="w-4 h-4 text-teal-600" /> Customer Information
              </h4>
              <p className="font-bold text-slate-900 text-base">{booking.customer?.fullName}</p>
              <div className="space-y-1 text-xs text-slate-600">
                <p className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{booking.customer?.email}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>Phone: {booking.customer?.phone}</span>
                </p>
                <p className="flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp: {booking.customer?.whatsApp}</span>
                </p>
              </div>

              {/* Direct Offline Actions */}
              <div className="pt-2 flex gap-2">
                <a
                  href={`tel:${booking.customer?.phone}`}
                  className="flex-1 text-center py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100"
                >
                  Call Phone
                </a>
                <a
                  href={`https://wa.me/91${booking.customer?.whatsApp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 text-center py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700"
                >
                  Open WhatsApp
                </a>
              </div>
            </div>

            {/* Address */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-teal-600" /> Venue Address
              </h4>
              <p className="text-sm font-semibold text-slate-900">{booking.address?.fullName}</p>
              <p className="text-xs text-slate-600">
                {booking.address?.apartmentUnit}, {booking.address?.addressLine}
              </p>
              {booking.address?.landmark && (
                <p className="text-xs text-slate-500">Landmark: {booking.address?.landmark}</p>
              )}
              <p className="text-xs text-slate-600">
                {booking.address?.city}, {booking.address?.state} - {booking.address?.postalCode}
              </p>
            </div>
          </div>

          {/* Service Specs & Financials */}
          <div className="space-y-4">
            {/* Service & Schedule */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-600" /> Service & Schedule
              </h4>
              <p className="font-bold text-slate-900">{booking.service?.name}</p>
              <p className="text-xs text-slate-600">
                Property: {booking.property?.bedrooms} Bed, {booking.property?.bathrooms} Bath ({booking.property?.propertyType})
              </p>
              <div className="bg-teal-50 p-2.5 rounded-lg border border-teal-100 text-xs text-teal-900 font-semibold flex items-center justify-between">
                <span>Date: {formatDate(booking.schedule?.date)}</span>
                <span>Time: {booking.schedule?.timeSlot}</span>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-teal-600" /> Payment Breakdown
              </h4>
              <div className="space-y-1 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(booking.pricing?.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes (GST 18%)</span>
                  <span>+{formatCurrency(booking.pricing?.tax)}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200 font-bold text-slate-900 text-sm">
                  <span>Total Amount</span>
                  <span className="text-teal-700">{formatCurrency(booking.pricing?.total)}</span>
                </div>
                <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Method: {booking.payment?.method || 'Online'}</span>
                  <span>Txn Ref: {booking.payment?.transactionId || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Special Instructions & Admin Internal Notes */}
        <div className="border-t border-slate-200 pt-4 space-y-4">
          {booking.property?.specialRequirements && (
            <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200 text-xs text-amber-900">
              <span className="font-bold block mb-0.5">Customer Special Note:</span>
              <span>{booking.property.specialRequirements}</span>
            </div>
          )}

          {/* Internal Notes Section */}
          <div className="space-y-2">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <FileText className="w-4 h-4 text-teal-600" /> Admin Internal Log Notes
            </h4>
            {booking.notes ? (
              <pre className="bg-slate-100 p-3 rounded-xl text-xs font-mono text-slate-700 whitespace-pre-wrap">
                {booking.notes}
              </pre>
            ) : (
              <p className="text-xs text-slate-400 italic">No internal notes added yet.</p>
            )}

            {/* Add Note Form */}
            <form onSubmit={handleAddNote} className="flex gap-2 pt-1">
              <input
                type="text"
                placeholder="Append internal note (e.g., Assigned Cleaner Ramesh)..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                className="flex-1 rounded-xl border border-slate-300 px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <Button
                variant="primary"
                size="sm"
                type="submit"
                icon={Send}
                isLoading={addNoteMutation.isPending}
              >
                Add Note
              </Button>
            </form>
          </div>
        </div>
      </div>
    </Modal>
  );
};
