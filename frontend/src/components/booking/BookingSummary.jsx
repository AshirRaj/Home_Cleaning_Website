import { useBookingStore } from '../../store/bookingStore';
import { PriceBreakdown } from './PriceBreakdown';
import { Button } from '../common/Button';
import { formatDate, formatCurrency } from '../../utils/formatters';
import { Edit2, Sparkles, Home, MapPin, Calendar, User, Banknote } from 'lucide-react';

export const BookingSummary = ({ onProceedPayment, setStep }) => {
  const { bookingState, pricing, selectedServices } = useBookingStore();
  const { property, address, schedule, customer, selectedAddons } = bookingState;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-1">Review Your Booking</h2>
        <p className="text-sm text-slate-500">
          Verify all details before choosing your payment preference (Pay After Completion or Online).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Details Sections */}
        <div className="lg:col-span-2 space-y-4">
          {/* Selected Services Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-teal-100 text-teal-700">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Selected Services</h3>
                  <p className="text-xs text-teal-700 font-semibold">{selectedServices.length} Service{selectedServices.length > 1 ? 's' : ''} Included</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1 cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" /> Edit
              </button>
            </div>

            <div className="space-y-2">
              {selectedServices.map((serv) => (
                <div key={serv.id} className="flex justify-between items-center text-sm p-2.5 bg-slate-50 rounded-xl">
                  <div>
                    <span className="font-bold text-slate-900 block">{serv.name}</span>
                    <span className="text-[11px] text-slate-500">Est. {serv.estimatedDuration}</span>
                  </div>
                  <span className="font-extrabold text-slate-900">{formatCurrency(serv.startingPrice)}</span>
                </div>
              ))}
            </div>

            {selectedAddons.length > 0 && (
              <div className="pt-2 border-t border-slate-100 space-y-1">
                <span className="text-xs font-semibold text-slate-500 block">Selected Add-ons:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedAddons.map((addon) => (
                    <span key={addon.id} className="text-xs bg-teal-50 text-teal-800 font-medium px-2.5 py-1 rounded-md border border-teal-100">
                      + {addon.name} ({formatCurrency(addon.price)})
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Property Details */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-teal-100 text-teal-700">
                  <Home className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Property Details</h3>
              </div>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1 cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" /> Edit
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-600">
              <div>
                <span className="block font-medium text-slate-400">Type</span>
                <span className="font-semibold text-slate-900 text-sm">{property.propertyType}</span>
              </div>
              <div>
                <span className="block font-medium text-slate-400">Bedrooms</span>
                <span className="font-semibold text-slate-900 text-sm">{property.bedrooms} Bed</span>
              </div>
              <div>
                <span className="block font-medium text-slate-400">Bathrooms</span>
                <span className="font-semibold text-slate-900 text-sm">{property.bathrooms} Bath</span>
              </div>
              <div>
                <span className="block font-medium text-slate-400">Living Rooms</span>
                <span className="font-semibold text-slate-900 text-sm">{property.livingRooms} Living</span>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-teal-100 text-teal-700">
                  <MapPin className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Cleaning Location</h3>
              </div>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1 cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" /> Edit
              </button>
            </div>
            <div className="text-sm text-slate-700 leading-relaxed">
              <p className="font-bold text-slate-900">{address.fullName}</p>
              <p>{address.apartmentUnit}, {address.addressLine}</p>
              {address.landmark && <p className="text-xs text-slate-500">Landmark: {address.landmark}</p>}
              <p>{address.city}, {address.state} - {address.postalCode}</p>
            </div>
          </div>

          {/* Schedule & Customer Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Schedule */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Calendar className="w-4 h-4 text-teal-600" />
                  <span>Date & Slot</span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="text-xs font-bold text-teal-600 cursor-pointer"
                >
                  Edit
                </button>
              </div>
              <p className="text-sm font-semibold text-slate-900">{formatDate(schedule.date)}</p>
              <p className="text-xs text-teal-700 font-bold">{schedule.timeSlot}</p>
            </div>

            {/* Customer Contact */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <User className="w-4 h-4 text-teal-600" />
                  <span>Contact Info</span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(5)}
                  className="text-xs font-bold text-teal-600 cursor-pointer"
                >
                  Edit
                </button>
              </div>
              <p className="text-sm font-semibold text-slate-900">{customer.fullName}</p>
              <p className="text-xs text-slate-500">{customer.email}</p>
              <p className="text-xs text-slate-500">WhatsApp: {customer.whatsApp}</p>
            </div>
          </div>
        </div>

        {/* Right Col: Price Breakdown & CTA */}
        <div className="space-y-6">
          <PriceBreakdown
            pricing={pricing}
            selectedAddons={selectedAddons}
          />

          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 font-bold text-xs text-emerald-900">
              <Banknote className="w-4 h-4 text-emerald-600" />
              <span>Zero Upfront Payment Option Available</span>
            </div>
            <p className="text-[11px] text-emerald-800 leading-relaxed">
              You can choose to pay Cash or UPI directly to the cleaner after completion of work.
            </p>
          </div>

          <Button
            variant="primary"
            size="lg"
            className="w-full shadow-lg shadow-teal-600/30 py-4 text-base"
            onClick={onProceedPayment}
          >
            Select Payment Method & Confirm →
          </Button>
        </div>
      </div>
    </div>
  );
};
