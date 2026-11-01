import { Link, useLocation } from 'react-router-dom';
import { useBookingStore } from '../../store/bookingStore';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Button } from '../../components/common/Button';
import { WhatsAppIcon } from '../../components/common/WhatsAppButton';
import {
  CheckCircle2,
  Printer,
  Home,
  Headphones,
  Banknote,
  Smartphone,
} from 'lucide-react';

export const BookingSuccess = () => {
  const location = useLocation();
  const { bookingState, resetBooking } = useBookingStore();

  const booking = location.state?.booking || {
    id: bookingState.bookingId || 'CLN-2026-9812',
    customer: bookingState.customer,
    service: bookingState.service,
    address: bookingState.address,
    schedule: bookingState.schedule,
    pricing: { total: bookingState.pricing?.total || 3499 },
    payment: { status: 'Pending (Pay After Work)', method: 'Pay After Service' },
  };

  const isPayAfterService = booking.payment?.method?.includes('Pay After Service') || booking.payment?.status?.includes('Pay After');
  const customerPhone = booking.customer?.phone || booking.customer?.whatsApp || '7681045009';

  // Pre-formatted WhatsApp message containing full booking requirements
  const whatsAppMessage = `Hello SAGARIKA ODICARE SERVICES, I have completed a home cleaning booking!\n\n📋 *Booking Details*:\n• *Booking ID*: ${booking.id}\n• *Service*: ${booking.service?.name}\n• *Date & Slot*: ${formatDate(booking.schedule?.date)} (${booking.schedule?.timeSlot})\n• *Address*: ${booking.address?.apartmentUnit}, ${booking.address?.addressLine}, ${booking.address?.city}\n• *Amount*: ${formatCurrency(booking.pricing?.total)}\n• *Payment Mode*: ${booking.payment?.method}\n\nPlease confirm cleaner arrival schedule.`;

  const whatsAppUrl = `https://wa.me/917681045009?text=${encodeURIComponent(whatsAppMessage)}`;

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-slate-800 space-y-8">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/20">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <div className="space-y-2">
          <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-600">
            SAGARIKA ODICARE SERVICES • RESERVATION CONFIRMED
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Thank You For Your Booking!
          </h1>
          <p className="text-slate-600 text-sm max-w-md mx-auto font-medium">
            We have received your home cleaning request. Our team will contact you soon to confirm cleaner arrival.
          </p>
        </div>

        {/* Booking ID Pill */}
        <div className="inline-flex items-center gap-3 bg-slate-900 text-white px-6 py-3 rounded-2xl font-mono text-base font-bold shadow-md">
          <span>Booking ID:</span>
          <span className="text-teal-400">{booking.id}</span>
        </div>

        {/* SMS & Mobile Confirmation Card */}
        <div className="bg-sky-50 border border-sky-200 rounded-2xl p-5 text-left space-y-2 max-w-lg mx-auto shadow-2xs">
          <div className="flex items-center gap-2 font-bold text-xs text-sky-950">
            <Smartphone className="w-4 h-4 text-sky-600 shrink-0" />
            <span>SMS & WhatsApp Confirmation Delivered to +91 {customerPhone}</span>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-sky-100 text-xs text-slate-700 space-y-1 font-mono leading-relaxed">
            <p className="font-bold text-slate-900 font-sans text-[11px]">Message Delivered:</p>
            <p>
              "Thank you for your home cleaning booking with SAGARIKA ODICARE SERVICES! Your Booking ID is <strong className="text-teal-700">{booking.id}</strong>. We will contact you soon to confirm cleaner arrival. For support, call 7681045009."
            </p>
          </div>
        </div>

        {/* Send to WhatsApp Direct Button with official WhatsApp icon */}
        <div className="pt-1">
          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-6 py-3.5 rounded-2xl text-sm shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
          >
            <WhatsAppIcon className="w-5 h-5 text-white" />
            <span>Send Booking Specs via WhatsApp →</span>
          </a>
        </div>

        {/* Pay After Service Highlight Banner */}
        {isPayAfterService && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-950 space-y-1.5 max-w-lg mx-auto text-left">
            <div className="flex items-center gap-2 font-bold text-sm text-emerald-800">
              <Banknote className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Zero Upfront Payment — Pay After Service Completion</span>
            </div>
            <p className="text-[11px] text-emerald-900 leading-relaxed">
              No online payment was required now. You can pay <strong className="text-emerald-950 font-bold">{formatCurrency(booking.pricing?.total)}</strong> via cash or scan UPI directly to our team leader after inspecting your clean home.
            </p>
          </div>
        )}

        {/* Breakdown Card */}
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 text-left space-y-4">
          <h3 className="text-xs uppercase font-extrabold tracking-wider text-slate-400 border-b border-slate-200 pb-2">
            Home Cleaning Summary
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <span className="text-slate-400 block font-medium">Service Package</span>
              <span className="font-bold text-slate-900 text-sm">{booking.service?.name}</span>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 block font-medium">Payment Mode & Status</span>
              <span className="font-extrabold text-teal-700 text-sm">
                {formatCurrency(booking.pricing?.total)} — {booking.payment?.status || 'Pending (Pay After Work)'}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 block font-medium">Date & Arrival Time</span>
              <span className="font-bold text-slate-900">
                {formatDate(booking.schedule?.date)} at {booking.schedule?.timeSlot}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 block font-medium">Venue Address</span>
              <span className="font-bold text-slate-900">
                {booking.address?.apartmentUnit}, {booking.address?.addressLine}, {booking.address?.city}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-slate-100">
          <Link to={`/track-booking?id=${booking.id}`} className="w-full sm:w-auto">
            <Button variant="primary" size="lg" className="w-full sm:w-auto font-bold shadow-md shadow-teal-600/20">
              Track Live Status ➔
            </Button>
          </Link>
          <Link to="/" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" icon={Home} className="w-full sm:w-auto" onClick={() => resetBooking()}>
              Back to Home
            </Button>
          </Link>
          <Link to="/contact" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" icon={Headphones} className="w-full sm:w-auto">
              Contact Support
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="lg"
            icon={Printer}
            onClick={() => window.print()}
            className="w-full sm:w-auto"
          >
            Print Receipt
          </Button>
        </div>
      </div>
    </div>
  );
};
