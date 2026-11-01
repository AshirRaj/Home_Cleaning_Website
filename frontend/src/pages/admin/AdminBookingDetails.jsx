import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBooking } from '../../hooks/useBooking';
import { useUpdateBookingStatus, useAddBookingNote } from '../../hooks/useBookings';
import { BookingStatusBadge, PaymentStatusBadge } from '../../components/admin/BookingStatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Button } from '../../components/common/Button';
import { Skeleton } from '../../components/common/Skeleton';
import { ErrorState } from '../../components/common/ErrorState';
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  CreditCard,
  MessageSquare,
  FileText,
  Send,
} from 'lucide-react';

export const AdminBookingDetails = () => {
  const { bookingId } = useParams();
  const { data: booking, isLoading, isError, refetch } = useBooking(bookingId);
  const updateStatusMutation = useUpdateBookingStatus();
  const addNoteMutation = useAddBookingNote();

  const [noteText, setNoteText] = useState('');

  if (isLoading) {
    return <Skeleton className="h-96 w-full rounded-2xl" />;
  }

  if (isError || !booking) {
    return <ErrorState title="Booking Not Found" message={`Booking #${bookingId} does not exist.`} onRetry={refetch} />;
  }

  const handleStatusUpdate = (status) => {
    updateStatusMutation.mutate({ id: booking.id, status });
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    addNoteMutation.mutate(
      { id: booking.id, noteText },
      { onSuccess: () => setNoteText('') }
    );
  };

  const statuses = ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'];

  return (
    <div className="space-y-6">
      {/* Top Back Nav */}
      <div className="flex items-center justify-between">
        <Link to="/admin/bookings" className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" /> Back to Bookings List
        </Link>
        <span className="text-xs font-mono font-bold text-slate-400">ID: {booking.id}</span>
      </div>

      {/* Status Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-white font-mono">{booking.id}</h1>
            <BookingStatusBadge status={booking.status} />
            <PaymentStatusBadge status={booking.payment?.status} />
          </div>
          <p className="text-xs text-slate-400">Created at {new Date(booking.createdAt).toLocaleString('en-IN')}</p>
        </div>

        {/* Quick Status Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => handleStatusUpdate(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                booking.status === st
                  ? 'bg-teal-500 text-slate-950 font-black shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer & Address */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-xs uppercase font-extrabold tracking-wider text-slate-400 flex items-center gap-2">
              <User className="w-4 h-4 text-teal-600" /> Customer Information
            </h3>
            <p className="text-lg font-bold text-slate-900">{booking.customer?.fullName}</p>
            <div className="space-y-1.5 text-xs text-slate-600">
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400" /> {booking.customer?.email}
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400" /> Phone: {booking.customer?.phone}
              </p>
              <p className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-600" /> WhatsApp: {booking.customer?.whatsApp}
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-xs uppercase font-extrabold tracking-wider text-slate-400 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-teal-600" /> Service Location
            </h3>
            <p className="text-sm font-semibold text-slate-900">{booking.address?.fullName}</p>
            <p className="text-xs text-slate-600">{booking.address?.apartmentUnit}, {booking.address?.addressLine}</p>
            {booking.address?.landmark && <p className="text-xs text-slate-500">Landmark: {booking.address?.landmark}</p>}
            <p className="text-xs text-slate-600">{booking.address?.city}, {booking.address?.state} - {booking.address?.postalCode}</p>
          </div>
        </div>

        {/* Service & Financials */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-xs uppercase font-extrabold tracking-wider text-slate-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-600" /> Service Specs
            </h3>
            <p className="text-base font-bold text-slate-900">{booking.service?.name}</p>
            <p className="text-xs text-slate-600">
              Property: {booking.property?.bedrooms} Bed, {booking.property?.bathrooms} Bath ({booking.property?.propertyType})
            </p>
            <p className="text-xs text-teal-700 font-bold">
              Schedule: {formatDate(booking.schedule?.date)} ({booking.schedule?.timeSlot})
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-xs uppercase font-extrabold tracking-wider text-slate-400 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-teal-600" /> Financial Breakdown
            </h3>
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(booking.pricing?.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (18%)</span>
                <span>+{formatCurrency(booking.pricing?.tax)}</span>
              </div>
              <div className="flex justify-between font-bold text-slate-900 text-sm pt-2 border-t border-slate-100">
                <span>Total Amount</span>
                <span className="text-teal-700">{formatCurrency(booking.pricing?.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Internal Log Notes */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <h3 className="text-xs uppercase font-extrabold tracking-wider text-slate-400 flex items-center gap-2">
          <FileText className="w-4 h-4 text-teal-600" /> Internal Notes Log
        </h3>
        {booking.notes ? (
          <pre className="bg-slate-50 p-4 rounded-xl text-xs font-mono text-slate-700 whitespace-pre-wrap">
            {booking.notes}
          </pre>
        ) : (
          <p className="text-xs text-slate-400 italic">No notes appended yet.</p>
        )}

        <form onSubmit={handleAddNote} className="flex gap-2 pt-2">
          <input
            type="text"
            placeholder="Type note to append..."
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            className="flex-1 rounded-xl border border-slate-300 p-2.5 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
          />
          <Button variant="primary" size="sm" type="submit" icon={Send}>
            Add Note
          </Button>
        </form>
      </div>
    </div>
  );
};
