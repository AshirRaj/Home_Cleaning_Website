import { useBookingStore } from '../../store/bookingStore';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Home, Bed, Bath, Maximize2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const PropertyForm = ({ onNext, onBack }) => {
  const { bookingState, updateProperty } = useBookingStore();
  const property = bookingState.property;

  const propertyTypes = [
    { value: 'Apartment', label: 'Apartment / Flat' },
    { value: 'House', label: 'Independent House / Bungalow' },
    { value: 'Villa', label: 'Villa / Duplex' },
    { value: 'Other', label: 'Other Residential Property' },
  ];

  const bedrooms = property.bedrooms ?? 1;
  const bathrooms = property.bathrooms ?? 1;
  const livingRooms = property.livingRooms ?? 1;

  const totalRooms = bedrooms + bathrooms + livingRooms;

  const counterButton = (field, currentVal, min = 0) => (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => updateProperty({ [field]: Math.max(min, currentVal - 1) })}
        className="w-7 h-7 rounded-lg border border-slate-300 bg-white text-slate-700 font-bold hover:bg-slate-100 flex items-center justify-center text-sm cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        disabled={currentVal <= min}
      >
        -
      </button>
      <span className="w-6 text-center font-bold text-slate-900 text-sm">{currentVal}</span>
      <button
        type="button"
        onClick={() => updateProperty({ [field]: currentVal + 1 })}
        className="w-7 h-7 rounded-lg border border-slate-300 bg-white text-slate-700 font-bold hover:bg-slate-100 flex items-center justify-center text-sm cursor-pointer transition-all"
      >
        +
      </button>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="space-y-4"
    >
      <div>
        <h2 className="text-lg font-bold text-slate-900">Home Specifications</h2>
        <p className="text-xs text-slate-500">
          Specify your property type and room counts to customize cleaning team allocation.
        </p>
      </div>

      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        {/* Top Row: Property Type & Size side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Home Type"
            required
            options={propertyTypes}
            value={property.propertyType}
            onChange={(e) => updateProperty({ propertyType: e.target.value })}
          />
          <Input
            label="Approximate Home Area (Optional)"
            placeholder="e.g. 1400 sq ft"
            icon={Maximize2}
            value={property.propertySize}
            onChange={(e) => updateProperty({ propertySize: e.target.value })}
          />
        </div>

        {/* Rooms Counter Grid (Compact 3 Columns) */}
        <div>
          <span className="block text-xs font-bold text-slate-700 mb-2">Room Counts</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Bedrooms */}
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-teal-100 text-teal-700">
                  <Bed className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-900">Bedrooms</span>
              </div>
              {counterButton('bedrooms', bedrooms, 0)}
            </div>

            {/* Bathrooms */}
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-teal-100 text-teal-700">
                  <Bath className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-900">Bathrooms</span>
              </div>
              {counterButton('bathrooms', bathrooms, 0)}
            </div>

            {/* Living Rooms */}
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-teal-100 text-teal-700">
                  <Home className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-900">Living / Halls</span>
              </div>
              {counterButton('livingRooms', livingRooms, 0)}
            </div>
          </div>
        </div>

        {/* Warning if totalRooms is 0 */}
        {totalRooms === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-lg text-xs font-semibold"
          >
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>
              All room counts are set to 0. Please select at least 1 room to proceed.
            </span>
          </motion.div>
        )}

        {/* Special Instructions / Requirements (Compact) */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-slate-700">
            Special Cleaning Focus Areas (Optional)
          </label>
          <textarea
            rows={2}
            className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-slate-400"
            placeholder="e.g., Please focus heavily on kitchen grease or balcony glass."
            value={property.specialRequirements}
            onChange={(e) => updateProperty({ specialRequirements: e.target.value })}
          />
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-2">
        <Button variant="outline" size="md" onClick={onBack}>
          ← Back
        </Button>
        <Button
          variant="primary"
          size="md"
          onClick={onNext}
          isDisabled={totalRooms === 0}
        >
          Continue to Address →
        </Button>
      </div>
    </motion.div>
  );
};
