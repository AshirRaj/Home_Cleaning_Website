import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { customerDetailsSchema } from '../../utils/validation';
import { useBookingStore } from '../../store/bookingStore';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { User, Mail, Phone, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

export const CustomerDetailsForm = ({ onNext, onBack }) => {
  const { bookingState, updateCustomer } = useBookingStore();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(customerDetailsSchema),
    defaultValues: {
      fullName: bookingState.customer.fullName || bookingState.address.fullName || '',
      email: bookingState.customer.email || bookingState.address.email || '',
      phone: bookingState.customer.phone || bookingState.address.phone || '',
      whatsApp: bookingState.customer.whatsApp || bookingState.customer.phone || bookingState.address.phone || '',
      alternatePhone: bookingState.customer.alternatePhone || '',
      specialInstructions: bookingState.customer.specialInstructions || '',
      agreeTerms: bookingState.customer.agreeTerms ?? true,
      agreeNotifications: bookingState.customer.agreeNotifications ?? true,
    },
  });

  const handleCopyPhoneToWhatsApp = (e) => {
    if (e.target.checked) {
      const currentPhone = watch('phone');
      if (currentPhone) {
        setValue('whatsApp', currentPhone, { shouldValidate: true });
      }
    }
  };

  const onSubmitForm = (data) => {
    updateCustomer(data);
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
      <div>
        <h2 className="text-lg font-bold text-slate-900">Customer Contact Details</h2>
        <p className="text-xs text-slate-500">
          Enter contact details where confirmation updates will be delivered.
        </p>
      </div>

      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
        {/* Full Name + Email + Phone Row (3 Columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            label="Customer Full Name"
            required
            icon={User}
            placeholder="Aarav Sharma"
            error={errors.fullName?.message}
            {...register('fullName')}
          />
          <Input
            label="Email Address"
            required
            icon={Mail}
            placeholder="aarav@example.com"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Primary Phone Number"
            required
            icon={Phone}
            placeholder="10-digit mobile number"
            error={errors.phone?.message}
            {...register('phone')}
          />
        </div>

        {/* WhatsApp & Alternate Phone Row (2 Columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Input
              label="WhatsApp Number"
              required
              icon={MessageSquare}
              placeholder="10-digit WhatsApp number"
              error={errors.whatsApp?.message}
              {...register('whatsApp')}
            />
            <label className="flex items-center gap-1.5 mt-1 cursor-pointer">
              <input
                type="checkbox"
                className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                onChange={handleCopyPhoneToWhatsApp}
              />
              <span className="text-[11px] text-slate-500">Same as primary phone number</span>
            </label>
          </div>

          <Input
            label="Alternate Phone (Optional)"
            icon={Phone}
            placeholder="Secondary contact number"
            error={errors.alternatePhone?.message}
            {...register('alternatePhone')}
          />
        </div>

        {/* Special Instructions (Compact) */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-slate-700">
            Special Cleaning Instructions / Notes (Optional)
          </label>
          <textarea
            rows={2}
            className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-slate-400"
            placeholder="e.g., Gate entry password, pet inside home, or parking instructions."
            {...register('specialInstructions')}
          />
        </div>

        {/* Terms Checkboxes */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 shrink-0"
              {...register('agreeTerms')}
            />
            <span className="text-xs text-slate-600">
              I agree to the <span className="font-semibold text-slate-900 underline">Terms and Conditions</span> & Privacy Policy.
            </span>
          </label>
          {errors.agreeTerms && (
            <p className="text-xs text-rose-600 font-medium pl-6">{errors.agreeTerms.message}</p>
          )}

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 shrink-0"
              {...register('agreeNotifications')}
            />
            <span className="text-xs text-slate-600">
              I agree to receive instant booking notifications via email and WhatsApp.
            </span>
          </label>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-2">
        <Button variant="outline" size="md" type="button" onClick={onBack}>
          ← Back
        </Button>
        <Button variant="primary" size="md" type="submit">
          Proceed to Review Booking →
        </Button>
      </div>
    </motion.form>
  );
};
