import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { bookingApi } from '../../api/bookingApi';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  Search,
  CheckCircle2,
  Clock,
  UserCheck,
  Truck,
  Sparkles,
  AlertCircle,
  Phone,
  MapPin,
  Calendar,
  ShieldCheck,
  MessageSquare,
  ArrowRight,
  RefreshCw,
  Check,
  XCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';

const TRACKING_STEPS = [
  {
    key: 'Confirmed',
    label: 'Booking Confirmed',
    description: 'Service scheduled & slot locked in system',
    icon: CheckCircle2,
  },
  {
    key: 'Assigned',
    label: 'Crew Assigned',
    description: 'Professional cleaning team assigned to your task',
    icon: UserCheck,
  },
  {
    key: 'Cleaner on the Way',
    label: 'Cleaner En Route',
    description: 'Cleaners are traveling to your destination',
    icon: Truck,
  },
  {
    key: 'In Progress',
    label: 'Service In Progress',
    description: 'Deep scrubbing & sanitization currently underway',
    icon: Sparkles,
  },
  {
    key: 'Completed',
    label: 'Service Completed',
    description: 'Thorough cleaning finished & quality verified',
    icon: Check,
  },
];

const getStepIndex = (status) => {
  if (status === 'Cancelled') return -1;
  const map = {
    Pending: 0,
    Confirmed: 0,
    Assigned: 1,
    'Cleaner on the Way': 2,
    'In Progress': 3,
    Completed: 4,
  };
  return map[status] ?? 0;
};

export const TrackBooking = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('id') || searchParams.get('query') || '';

  const [queryInput, setQueryInput] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(Boolean(initialQuery));
  const [errorMessage, setErrorMessage] = useState('');
  const [bookingsList, setBookingsList] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const fetchTracking = async (searchVal) => {
    if (!searchVal || !searchVal.trim()) {
      setErrorMessage('Please enter your Booking ID or registered phone number.');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage('');
      const data = await bookingApi.trackBooking(searchVal.trim());

      if (data?.bookings && data.bookings.length > 0) {
        setBookingsList(data.bookings);
        setSelectedBooking(data.bookings[0]);
        setSearchParams({ id: data.bookings[0].bookingId });
      } else if (data?.booking) {
        setBookingsList([data.booking]);
        setSelectedBooking(data.booking);
        setSearchParams({ id: data.booking.bookingId });
      } else {
        setErrorMessage('No booking records found. Please verify your reference number.');
      }
    } catch (err) {
      setBookingsList([]);
      setSelectedBooking(null);
      setErrorMessage(
        err.response?.data?.message ||
          err.message ||
          'No booking found matching your details. Please check your Booking ID or Phone.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    if (initialQuery) {
      bookingApi
        .trackBooking(initialQuery.trim())
        .then((data) => {
          if (ignore) return;
          if (data?.bookings?.length) {
            setBookingsList(data.bookings);
            setSelectedBooking(data.bookings[0]);
          } else if (data?.booking) {
            setBookingsList([data.booking]);
            setSelectedBooking(data.booking);
          }
        })
        .catch((err) => {
          if (ignore) return;
          setErrorMessage(
            err.response?.data?.message || err.message || 'No booking found matching your details.'
          );
        })
        .finally(() => {
          if (!ignore) setIsLoading(false);
        });
    }
    return () => {
      ignore = true;
    };
  }, [initialQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchTracking(queryInput);
  };

  const currentStepIdx = selectedBooking ? getStepIndex(selectedBooking.status) : 0;
  const isCancelled = selectedBooking?.status === 'Cancelled';

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Hero Header */}
        <div className="text-center space-y-3 pt-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" /> Live Service Tracking
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Track Your Cleaning Service
          </h1>
          <p className="text-sm text-slate-600 max-w-xl mx-auto">
            Check the real-time progress of your home cleaning, cleaner arrival status, and service schedule.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl shadow-sm border border-slate-200">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Input
                placeholder="Enter Booking ID (e.g. BK-2026-...) or Mobile Number"
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                icon={Search}
                className="w-full text-sm sm:text-base py-3"
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="shrink-0 px-8 shadow-md shadow-teal-600/20 font-bold"
            >
              <Search className="w-4 h-4 mr-2" /> Track Booking
            </Button>
          </form>

          {/* Quick Helpful Hint */}
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
            <span>Tip: Enter your 10-digit mobile number to view all your recent bookings.</span>
            {selectedBooking && (
              <button
                type="button"
                onClick={() => fetchTracking(queryInput || selectedBooking.bookingId)}
                className="text-teal-600 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" /> Refresh Status
              </button>
            )}
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3 text-sm"
          >
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold block">No Booking Found</span>
              <p className="text-xs text-rose-700">{errorMessage}</p>
            </div>
          </motion.div>
        )}

        {/* Multiple Bookings Switcher (If Customer has multiple bookings) */}
        {bookingsList.length > 1 && (
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Found {bookingsList.length} Bookings for this number:
            </span>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {bookingsList.map((b) => {
                const isSelected = selectedBooking?.bookingId === b.bookingId;
                return (
                  <button
                    key={b.bookingId}
                    type="button"
                    onClick={() => {
                      setSelectedBooking(b);
                      setSearchParams({ id: b.bookingId });
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold shrink-0 border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    #{b.bookingId} • {b.service?.name?.slice(0, 20)} ({b.status})
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Live Booking Tracking Details Card */}
        {selectedBooking && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Status Header Banner */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200 uppercase tracking-wider">
                      Booking #{selectedBooking.bookingId}
                    </span>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-md border ${
                        isCancelled
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : selectedBooking.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-teal-50 text-teal-700 border-teal-200'
                      }`}
                    >
                      Status: {selectedBooking.status}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                    {selectedBooking.service?.name || 'Home Cleaning Service'}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Booked by {selectedBooking.customer?.fullName} • {selectedBooking.property?.bedrooms || 1} BHK (
                    {selectedBooking.property?.propertyType || 'Apartment'})
                  </p>
                </div>

                <div className="sm:text-right shrink-0">
                  <span className="text-xs text-slate-400 block font-medium">Total Service Fee</span>
                  <span className="text-2xl sm:text-3xl font-black text-slate-900">
                    {formatCurrency(selectedBooking.pricing?.total || 0)}
                  </span>
                  <span
                    className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-full mt-1 ${
                      selectedBooking.payment?.status === 'Paid'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    Payment: {selectedBooking.payment?.status || 'Pending'}
                  </span>
                </div>
              </div>

              {/* Cancelled Alert Banner */}
              {isCancelled ? (
                <div className="bg-rose-50 border border-rose-200 p-5 rounded-2xl flex items-start gap-3">
                  <XCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-rose-900">This booking has been cancelled</h3>
                    <p className="text-xs text-rose-700 leading-relaxed">
                      If you made an online payment, your refund will be processed back to your original source account within 5 - 7 business days. Please contact our support team if you have any questions.
                    </p>
                  </div>
                </div>
              ) : (
                /* 5-STEP TRACKING TIMELINE */
                <div className="space-y-6 pt-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-teal-600" /> Service Progression Timeline
                    </h3>
                    <span className="text-xs text-slate-500">
                      Step {currentStepIdx + 1} of {TRACKING_STEPS.length}
                    </span>
                  </div>

                  {/* Horizontal Visual Stepper for Desktop */}
                  <div className="hidden md:grid grid-cols-5 gap-2 relative">
                    {/* Connecting Background Line */}
                    <div className="absolute top-5 left-8 right-8 h-1 bg-slate-200 -z-0" />
                    {/* Active Connecting Fill Line */}
                    <div
                      className="absolute top-5 left-8 h-1 bg-teal-600 -z-0 transition-all duration-700"
                      style={{
                        width: `${(currentStepIdx / (TRACKING_STEPS.length - 1)) * 82}%`,
                      }}
                    />

                    {TRACKING_STEPS.map((step, idx) => {
                      const Icon = step.icon;
                      const isPast = idx < currentStepIdx;
                      const isCurrent = idx === currentStepIdx;

                      return (
                        <div key={step.key} className="flex flex-col items-center text-center relative z-10 space-y-2">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                              isPast
                                ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
                                : isCurrent
                                ? 'bg-teal-600 text-white ring-4 ring-teal-100 shadow-lg shadow-teal-600/40 animate-pulse'
                                : 'bg-white border-2 border-slate-300 text-slate-400'
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <span
                              className={`text-xs block font-bold leading-tight ${
                                isCurrent
                                  ? 'text-teal-700'
                                  : isPast
                                  ? 'text-slate-800'
                                  : 'text-slate-400'
                              }`}
                            >
                              {step.label}
                            </span>
                            <span className="text-[10px] text-slate-500 block mt-0.5 leading-snug">
                              {step.description}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Vertical Stepper for Mobile */}
                  <div className="md:hidden space-y-4 pl-2 border-l-2 border-slate-200 ml-4">
                    {TRACKING_STEPS.map((step, idx) => {
                      const Icon = step.icon;
                      const isPast = idx < currentStepIdx;
                      const isCurrent = idx === currentStepIdx;

                      return (
                        <div key={step.key} className="relative pl-6 pb-2">
                          <div
                            className={`absolute -left-[17px] top-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                              isPast || isCurrent
                                ? 'bg-teal-600 text-white ring-4 ring-teal-50'
                                : 'bg-white border border-slate-300 text-slate-400'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="space-y-0.5">
                            <span
                              className={`text-xs block font-bold ${
                                isCurrent ? 'text-teal-700' : 'text-slate-800'
                              }`}
                            >
                              {step.label}
                            </span>
                            <p className="text-[11px] text-slate-500">{step.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Crew & Address Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cleaner Crew Card */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-teal-600" /> Assigned Cleaning Crew
                  </h3>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    Verified Staff
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-teal-100 flex items-center justify-center text-teal-800 font-bold text-lg shrink-0">
                    <Sparkles className="w-6 h-6 text-teal-600" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-sm font-bold text-slate-900 block">
                      {selectedBooking.assignedCleaner?.name || 'Sagarika Operations Crew'}
                    </span>
                    <span className="text-xs text-slate-500 block">
                      Lead Cleaner & Sanitization Specialist
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-2">
                  <a
                    href={`tel:${selectedBooking.assignedCleaner?.phone || '+917681045009'}`}
                    className="flex-1 py-2.5 px-4 bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold rounded-xl border border-teal-200 flex items-center justify-center gap-2 transition-colors"
                  >
                    <Phone className="w-4 h-4" /> Call Crew: {selectedBooking.assignedCleaner?.phone || '+91 76810 45009'}
                  </a>
                  <a
                    href={`https://wa.me/917681045009?text=${encodeURIComponent(
                      `Hello Sagarika Cleaning, I am tracking Booking #${selectedBooking.bookingId}.`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-xs"
                  >
                    <MessageSquare className="w-4 h-4" /> WhatsApp
                  </a>
                </div>
              </div>

              {/* Schedule & Address Card */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-teal-600" /> Arrival Time & Location
                  </h3>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-start gap-2.5">
                    <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900 block">Scheduled Arrival:</span>
                      <span className="text-slate-600">
                        {formatDate(selectedBooking.schedule?.date)} • Slot: {selectedBooking.schedule?.timeSlot}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900 block">Service Address:</span>
                      <span className="text-slate-600 leading-relaxed block">
                        {selectedBooking.address?.addressLine}
                        {selectedBooking.address?.landmark && `, Near ${selectedBooking.address.landmark}`},{' '}
                        {selectedBooking.address?.city}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Need Help Banner */}
        <div className="bg-gradient-to-r from-teal-800 to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg font-bold flex items-center justify-center sm:justify-start gap-2">
              <ShieldCheck className="w-5 h-5 text-teal-400" /> Need to Reschedule or Have Questions?
            </h3>
            <p className="text-xs text-slate-300 max-w-md">
              Our Odisha operations team is available 7 days a week from 8:00 AM to 8:00 PM to assist you.
            </p>
          </div>

          <div className="flex gap-3">
            <a
              href="tel:+917681045009"
              className="px-5 py-2.5 bg-white text-slate-900 rounded-xl text-xs font-bold hover:bg-slate-100 transition-colors shrink-0 shadow-md flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-teal-600" /> +91 76810 45009
            </a>
            <Link
              to="/contact"
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition-colors shrink-0 flex items-center gap-1.5"
            >
              Contact Us <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
