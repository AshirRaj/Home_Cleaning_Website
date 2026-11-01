import { useParams, useNavigate } from 'react-router-dom';
import { useService } from '../../hooks/useServices';
import { useBookingStore } from '../../store/bookingStore';
import { formatCurrency } from '../../utils/formatters';
import { Button } from '../../components/common/Button';
import { Skeleton } from '../../components/common/Skeleton';
import { ErrorState } from '../../components/common/ErrorState';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  ShieldCheck,
  Star,
  CalendarCheck,
  HelpCircle,
  Plus,
} from 'lucide-react';

export const ServiceDetails = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { data: service, isLoading, isError, refetch } = useService(serviceId);
  const { setService, setStep } = useBookingStore();

  const handleBookNow = () => {
    if (service) {
      setService(service);
      setStep(1);
      navigate('/book');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
        <Skeleton className="h-64 w-full rounded-3xl" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (isError || !service) {
    return <ErrorState title="Service Not Found" message="The requested cleaning service could not be located." onRetry={refetch} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Service Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-4 relative z-10">
          <div className="flex items-center gap-2">
            <span className="bg-teal-500/20 text-teal-300 border border-teal-500/40 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              {service.category}
            </span>
            <span className="flex items-center gap-1 text-amber-400 text-xs font-bold bg-slate-800 px-3 py-1 rounded-full">
              <Star className="w-3.5 h-3.5 fill-current" /> {service.rating} ({service.reviewCount} Reviews)
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            {service.name}
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
            {service.fullDescription}
          </p>

          <div className="flex items-center gap-6 pt-4 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-teal-400" />
              <span>Est. Duration: {service.estimatedDuration}</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-teal-400" />
              <span>100% Satisfaction Guarantee</span>
            </div>
          </div>
        </div>

        {/* Price & Booking Card */}
        <div className="lg:col-span-5 relative z-10">
          <div className="bg-white text-slate-900 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-xs text-slate-400 font-semibold block">Starting Price</span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-slate-900">{formatCurrency(service.startingPrice)}</span>
                <span className="text-xs text-slate-500">+ applicable taxes</span>
              </div>
            </div>

            <Button variant="primary" size="lg" icon={CalendarCheck} className="w-full py-4 text-base" onClick={handleBookNow}>
              Book This Service Now
            </Button>

            <div className="text-xs text-slate-500 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>No payment required until review step</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Free rescheduling up to 4 hours before</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Included vs Excluded & Benefits */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 cols: Included & Excluded */}
        <div className="lg:col-span-2 space-y-8">
          {/* Included */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              <span>What's Included</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {service.included?.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5 bg-emerald-50/40 p-3 rounded-xl border border-emerald-100 text-xs text-slate-800 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Excluded */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <XCircle className="w-6 h-6 text-rose-500" />
              <span>What's Excluded</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {service.excluded?.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5 bg-rose-50/40 p-3 rounded-xl border border-rose-100 text-xs text-slate-700">
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Service Add-ons Preview */}
          {service.availableAddons?.length > 0 && (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-6 h-6 text-teal-600" />
                <span>Available Add-ons For This Service</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {service.availableAddons.map((addon) => (
                  <div key={addon.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{addon.name}</span>
                    <span className="text-xs font-extrabold text-teal-700">+{formatCurrency(addon.price)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Key Benefits & FAQs */}
        <div className="space-y-8">
          {/* Key Benefits */}
          <div className="bg-gradient-to-br from-teal-900 to-slate-900 text-white p-6 rounded-2xl space-y-4">
            <h3 className="text-lg font-bold text-teal-300 flex items-center gap-2">
              <Sparkles className="w-5 h-5" /> Service Benefits
            </h3>
            <ul className="space-y-3 text-xs text-slate-200">
              {service.benefits?.map((b, i) => (
                <li key={i} className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* FAQs */}
          {service.faqs?.length > 0 && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-teal-600" /> Frequently Asked
              </h3>
              <div className="space-y-4">
                {service.faqs.map((faq, i) => (
                  <div key={i} className="space-y-1">
                    <p className="text-xs font-bold text-slate-900">Q: {faq.q}</p>
                    <p className="text-xs text-slate-500 leading-relaxed">A: {faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
