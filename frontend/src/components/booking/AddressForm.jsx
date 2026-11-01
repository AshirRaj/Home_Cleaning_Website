import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addressSchema } from '../../utils/validation';
import { useBookingStore } from '../../store/bookingStore';
import { locationApi } from '../../api/locationApi';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { MapPin, Navigation, User, Phone, Mail, Building, Home, CheckCircle2, AlertCircle, Search, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AddressForm = ({ onNext, onBack }) => {
  const { bookingState, updateAddress } = useBookingStore();
  const [isLocating, setIsLocating] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null); // { type: 'success' | 'warning' | 'error', text: string }
  const [formattedAddressSummary, setFormattedAddressSummary] = useState('');

  // Address Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchTimeoutRef = useRef(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      fullName: bookingState.address.fullName || '',
      phone: bookingState.address.phone || '',
      email: bookingState.address.email || '',
      addressLine: bookingState.address.addressLine || '',
      apartmentUnit: bookingState.address.apartmentUnit || '',
      landmark: bookingState.address.landmark || '',
      city: bookingState.address.city || 'Bhubaneswar',
      state: bookingState.address.state || 'Odisha',
      postalCode: bookingState.address.postalCode || '',
    },
  });

  const currentCityValue = watch('city') || bookingState.address.city || '';
  const baseCities = ['Bhubaneswar', 'Cuttack', 'Puri', 'Khorda'];
  const cityList = [...baseCities];
  if (currentCityValue && !cityList.includes(currentCityValue)) {
    cityList.push(currentCityValue);
  }
  const cityOptions = cityList.map((c) => ({ value: c, label: c }));

  const validateServiceArea = (city) => {
    if (!city) return false;
    const c = city.toLowerCase().trim();
    return ['bhubaneswar', 'cuttack', 'puri', 'khorda', 'khordha'].some((supported) => c.includes(supported));
  };

  const populateAddressFromLocation = (location) => {
    const streetAddress = location.street || '';
    const houseUnit = location.flatNumber || location.houseNumber || '';
    const landmark = location.landmark || '';
    const city = location.city || '';
    const state = location.state || '';
    const postalCode = location.postalCode || '';

    // Only update location-related fields (Never touch contact info!)
    setValue('addressLine', streetAddress, { shouldValidate: true });
    setValue('apartmentUnit', houseUnit, { shouldValidate: true });
    setValue('landmark', landmark, { shouldValidate: true });
    setValue('city', city, { shouldValidate: true });
    setValue('state', state, { shouldValidate: true });
    setValue('postalCode', postalCode, { shouldValidate: true });

    if (location.formattedAddress) {
      setFormattedAddressSummary(location.formattedAddress);
    }
  };

  const buildStatusMessage = (loc) => {
    const isSupported = validateServiceArea(loc.city);
    if (loc.city && !isSupported) {
      return {
        type: 'warning',
        text: `Location detected (${loc.city}), but service is currently unavailable in this area.`,
      };
    }

    const parts = [];
    if (loc.ward) {
      parts.push(loc.ward);
    }
    if (loc.city) {
      parts.push(loc.city);
    }

    let locStr = parts.join(', ');
    if (!locStr && loc.street) {
      locStr = loc.street;
    }
    if (!locStr && loc.district) {
      locStr = loc.district;
    }

    const pinStr = loc.postalCode ? ` (PIN: ${loc.postalCode})` : '';
    const accuracyStr = loc.accuracy ? ` • GPS accuracy ~${Math.round(loc.accuracy)}m` : '';

    if (loc.source === 'ip') {
      return {
        type: 'info',
        text: `✓ Approximate location detected: ${locStr || 'Region'}${pinStr}`,
      };
    }

    if (locStr) {
      return {
        type: 'success',
        text: `✓ Current location detected: ${locStr}${pinStr}${accuracyStr}`,
      };
    }

    return {
      type: 'success',
      text: `✓ Current location detected${pinStr}${accuracyStr}`,
    };
  };

  const handleUseCurrentLocation = async () => {
    try {
      setIsLocating(true);
      setStatusMsg(null);

      const locData = await locationApi.getCurrentLocation();
      populateAddressFromLocation(locData);

      const msgObj = buildStatusMessage(locData);
      setStatusMsg(msgObj);
    } catch (e) {
      console.error('Location error:', e);
      setStatusMsg({
        type: 'error',
        text: e.message || 'Unable to detect your current location. Please search or enter your address manually.',
      });
    } finally {
      setIsLocating(false);
    }
  };

  // Debounced Manual Address Search handler (~1 second debounce)
  const handleSearchInputChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!val || val.trim().length < 3) {
      setSearchResults([]);
      setShowSearchResults(false);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    setShowSearchResults(true);

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const results = await locationApi.searchAddress(val);
        setSearchResults(results);
      } catch (err) {
        console.warn('Search error:', err);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 1000);
  };

  const handleSelectSearchResult = (result) => {
    if (result && result.normalized) {
      populateAddressFromLocation(result.normalized);
      const msgObj = buildStatusMessage(result.normalized);
      setStatusMsg(msgObj);
    }
    setSearchQuery(result.displayName);
    setShowSearchResults(false);
  };

  const onSubmitForm = (data) => {
    updateAddress(data);
    onNext();
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      onSubmit={handleSubmit(onSubmitForm)}
      className="space-y-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Cleaning Location Address</h2>
          <p className="text-xs text-slate-500">Service available across Bhubaneswar, Cuttack, Puri & Khorda.</p>
        </div>

        {/* Use Current Location Button */}
        <Button
          variant="outline"
          size="sm"
          type="button"
          icon={Navigation}
          isLoading={isLocating}
          onClick={handleUseCurrentLocation}
          className="shrink-0 text-teal-700 border-teal-200 bg-teal-50 hover:bg-teal-100 text-xs"
        >
          {isLocating ? 'Detecting GPS...' : 'Use My Current Location'}
        </Button>
      </div>

      {/* Free Address Search Input */}
      <div className="relative">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchInputChange}
            placeholder="Search your address (e.g. Jaydev Vihar, Bhubaneswar)..."
            className="w-full pl-9 pr-9 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all text-slate-800 placeholder-slate-400 font-medium"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          {isSearching && (
            <Loader2 className="w-4 h-4 text-teal-600 animate-spin absolute right-3 top-1/2 -translate-y-1/2" />
          )}
        </div>

        {/* Floating Search Results Dropdown */}
        <AnimatePresence>
          {showSearchResults && searchResults.length > 0 && (
            <motion.ul
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              className="absolute z-50 left-0 right-0 top-full mt-1.5 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden max-h-60 overflow-y-auto divide-y divide-slate-100"
            >
              {searchResults.map((item, index) => (
                <li
                  key={index}
                  onClick={() => handleSelectSearchResult(item)}
                  className="p-3 hover:bg-teal-50/60 cursor-pointer transition-colors text-xs text-slate-700 flex items-start gap-2.5"
                >
                  <MapPin className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span className="leading-snug font-medium">{item.displayName}</span>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      {/* Status Message */}
      {statusMsg && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex items-center gap-2 p-2.5 rounded-lg text-xs font-semibold border ${
            statusMsg.type === 'warning'
              ? 'bg-amber-50 border-amber-200 text-amber-800'
              : statusMsg.type === 'error'
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}
        >
          {statusMsg.type === 'warning' ? (
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          ) : statusMsg.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          )}
          <span>{statusMsg.text}</span>
        </motion.div>
      )}

      {/* Detected Formatted Address Banner */}
      {formattedAddressSummary && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-600 flex items-start gap-2">
          <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
          <p className="line-clamp-2">
            <strong className="text-slate-800">Detected Address:</strong> {formattedAddressSummary}
          </p>
        </div>
      )}

      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
        {/* Contact Info Row (3 Columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            label="Full Name"
            required
            icon={User}
            placeholder="Subhashree Patnaik"
            error={errors.fullName?.message}
            {...register('fullName')}
          />
          <Input
            label="Phone Number"
            required
            icon={Phone}
            placeholder="10-digit mobile number"
            error={errors.phone?.message}
            {...register('phone')}
          />
          <Input
            label="Email Address"
            required
            icon={Mail}
            placeholder="subhashree@example.com"
            error={errors.email?.message}
            {...register('email')}
          />
        </div>

        {/* Address Lines (Combined 2 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2">
            <Input
              label="Street Address / Plot / Colony"
              required
              icon={MapPin}
              placeholder="Jaydev Vihar, NALCO Road"
              error={errors.addressLine?.message}
              {...register('addressLine')}
            />
          </div>
          <Input
            label="House / Unit No."
            icon={Home}
            placeholder="Flat 302, Royal Residency"
            error={errors.apartmentUnit?.message}
            {...register('apartmentUnit')}
          />
        </div>

        {/* Landmark + City + State + Postal Code Row (4 Columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <Input
            label="Landmark (Optional)"
            icon={Building}
            placeholder="Near Pal Heights Mall"
            error={errors.landmark?.message}
            {...register('landmark')}
          />
          <Select
            label="Service City"
            required
            options={cityOptions}
            error={errors.city?.message}
            {...register('city')}
          />
          <Input
            label="State"
            required
            placeholder="Odisha"
            error={errors.state?.message}
            {...register('state')}
          />
          <Input
            label="Postal Code"
            placeholder="751021"
            error={errors.postalCode?.message}
            {...register('postalCode')}
          />
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-2">
        <Button variant="outline" size="md" type="button" onClick={onBack}>
          ← Back
        </Button>
        <Button variant="primary" size="md" type="submit">
          Continue to Schedule →
        </Button>
      </div>
    </motion.form>
  );
};


