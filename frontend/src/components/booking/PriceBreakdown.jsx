import { formatCurrency } from '../../utils/formatters';
import { ShieldCheck, Layers } from 'lucide-react';
import { useBookingStore } from '../../store/bookingStore';

export const PriceBreakdown = ({ pricing, selectedAddons = [], serviceName }) => {
  const { selectedServices } = useBookingStore();
  const servicesList = selectedServices && selectedServices.length > 0 ? selectedServices : [];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
      <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center justify-between">
        <span>Payment Summary</span>
        <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full flex items-center gap-1">
          <Layers className="w-3.5 h-3.5" />
          {servicesList.length} Service{servicesList.length > 1 ? 's' : ''}
        </span>
      </h3>

      <div className="space-y-2.5 text-sm">
        {/* Selected Services Itemized List */}
        {servicesList.length > 0 ? (
          servicesList.map((serv) => (
            <div key={serv.id} className="flex justify-between text-slate-700 text-xs font-medium">
              <span className="font-semibold">{serv.name}</span>
              <span className="font-bold text-slate-900">{formatCurrency(serv.startingPrice)}</span>
            </div>
          ))
        ) : (
          <div className="flex justify-between text-slate-600">
            <span>{serviceName || 'Cleaning Service'} (Base)</span>
            <span className="font-semibold text-slate-900">{formatCurrency(pricing.basePrice)}</span>
          </div>
        )}

        {/* Room adjustments */}
        {pricing.adjustedServiceSubtotal > pricing.basePrice && (
          <div className="flex justify-between text-slate-600 text-xs">
            <span>Property & Room Size Adjustments</span>
            <span className="font-semibold text-slate-900">
              +{formatCurrency(pricing.adjustedServiceSubtotal - pricing.basePrice)}
            </span>
          </div>
        )}

        {/* Selected Addons */}
        {selectedAddons.map((addon) => (
          <div key={addon.id} className="flex justify-between text-slate-600 text-xs">
            <span>Add-on: {addon.name}</span>
            <span className="font-semibold text-slate-900">+{formatCurrency(addon.price)}</span>
          </div>
        ))}

        {/* Subtotal */}
        <div className="pt-2 border-t border-slate-100 flex justify-between font-semibold text-slate-800">
          <span>Subtotal</span>
          <span>{formatCurrency(pricing.subtotal)}</span>
        </div>

        {/* Taxes */}
        <div className="flex justify-between text-slate-500 text-xs">
          <span>Taxes & Service Fees (18% GST)</span>
          <span>+{formatCurrency(pricing.tax)}</span>
        </div>

        {/* Total */}
        <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-slate-900">
          <div>
            <span className="text-base font-extrabold block">Total Payable</span>
            <span className="text-[11px] text-slate-400">Inclusive of all taxes</span>
          </div>
          <span className="text-2xl font-black text-teal-600">{formatCurrency(pricing.total)}</span>
        </div>
      </div>

      <div className="pt-2">
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center gap-2.5 text-xs text-slate-600">
          <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
          <span>No hidden fees. Free cancellation up to 4 hours before slot.</span>
        </div>
      </div>
    </div>
  );
};
