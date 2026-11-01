import { useBookingStore } from '../../store/bookingStore';
import { MOCK_SERVICES } from '../../mock/services';
import { formatCurrency } from '../../utils/formatters';
import { Check, Sparkles, Plus, Layers } from 'lucide-react';
import { Button } from '../common/Button';
import { motion } from 'framer-motion';

export const ServiceSelector = ({ onNext }) => {
  const { bookingState, selectedServices, toggleService, toggleAddon } = useBookingStore();

  const isSelected = (servId) => selectedServices.some((s) => s.id === servId);

  // Consolidate available add-ons across all selected services
  const combinedAddons = selectedServices.reduce((acc, serv) => {
    if (serv.availableAddons) {
      serv.availableAddons.forEach((addon) => {
        if (!acc.some((a) => a.id === addon.id)) {
          acc.push(addon);
        }
      });
    }
    return acc;
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Select Cleaning Services</h2>
          <p className="text-xs text-slate-500">
            Select one or multiple services to combine in a single reservation.
          </p>
        </div>

        {/* Selected Services Counter Badge */}
        <div className="flex items-center gap-1.5 bg-teal-50 border border-teal-200 text-teal-900 px-3 py-1 rounded-full text-xs font-bold shrink-0">
          <Layers className="w-3.5 h-3.5 text-teal-600" />
          <span>{selectedServices.length} Service{selectedServices.length > 1 ? 's' : ''} Selected</span>
        </div>
      </div>

      {/* Services Multi-Select Grid (Compact 4-column layout) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {MOCK_SERVICES.map((serv) => {
          const selected = isSelected(serv.id);
          return (
            <motion.div
              key={serv.id}
              whileHover={{ y: -2 }}
              onClick={() => toggleService(serv)}
              className={`relative rounded-xl p-3.5 border-2 transition-all cursor-pointer flex flex-col justify-between ${
                selected
                  ? 'border-teal-600 bg-teal-50/50 shadow-xs ring-1 ring-teal-600/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              {serv.badge && (
                <span
                  className={`absolute top-2.5 right-2.5 text-[9px] font-extrabold px-2 py-0.2 rounded-full uppercase tracking-wider ${
                    selected ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {serv.badge}
                </span>
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                      selected ? 'bg-teal-600 text-white shadow-xs' : 'bg-teal-100 text-teal-700'
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div
                    className={`w-6 h-6 rounded-md flex items-center justify-center border transition-all ${
                      selected
                        ? 'bg-teal-600 text-white border-teal-600 font-bold'
                        : 'border-slate-300 bg-slate-50'
                    }`}
                  >
                    {selected ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5 text-slate-400" />}
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug">{serv.name}</h3>
                <p className="text-[11px] text-slate-500 leading-snug line-clamp-2">{serv.shortDescription}</p>
              </div>

              <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-medium">Starting</span>
                <span className="text-sm font-extrabold text-slate-900">
                  {formatCurrency(serv.startingPrice)}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Addons Selection Section (Compact) */}
      {combinedAddons.length > 0 && (
        <div className="pt-3 border-t border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <span>Optional Service Add-ons</span>
              <span className="text-[10px] bg-teal-100 text-teal-800 px-2 py-0.2 rounded-full font-semibold">
                Customize
              </span>
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {combinedAddons.map((addon) => {
              const isAddonSelected = bookingState.selectedAddons.some((item) => item.id === addon.id);
              return (
                <div
                  key={addon.id}
                  onClick={() => toggleAddon(addon)}
                  className={`p-2.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                    isAddonSelected
                      ? 'border-teal-500 bg-teal-50 text-teal-950 font-semibold shadow-2xs'
                      : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="pr-2">
                    <p className="text-xs font-semibold text-slate-900 leading-tight">{addon.name}</p>
                    <p className="text-[11px] text-teal-700 font-bold mt-0.5">
                      +{formatCurrency(addon.price)}
                    </p>
                  </div>
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center border transition-colors shrink-0 ${
                      isAddonSelected
                        ? 'bg-teal-600 border-teal-600 text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isAddonSelected && <Check className="w-3 h-3" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="flex justify-end pt-2">
        <Button variant="primary" size="md" onClick={onNext} isDisabled={selectedServices.length === 0}>
          Continue to Property Details →
        </Button>
      </div>
    </div>
  );
};
