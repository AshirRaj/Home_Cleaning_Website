import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBookingStore } from '../../store/bookingStore';
import { BookingStepper } from '../../components/booking/BookingStepper';
import { ServiceSelector } from '../../components/booking/ServiceSelector';
import { PropertyForm } from '../../components/booking/PropertyForm';
import { AddressForm } from '../../components/booking/AddressForm';
import { SchedulePicker } from '../../components/booking/SchedulePicker';
import { CustomerDetailsForm } from '../../components/booking/CustomerDetailsForm';

export const Booking = () => {
  const navigate = useNavigate();
  const { bookingState, setStep } = useBookingStore();
  const currentStep = bookingState.currentStep;

  // Safety check: If currentStep is beyond step 5, reset to Step 1
  useEffect(() => {
    if (currentStep > 5 || currentStep < 1) {
      setStep(1);
    }
  }, [currentStep, setStep]);

  const handleNextStep = () => {
    if (currentStep < 5) {
      setStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setStep(6);
      navigate('/book/review');
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const activeStep = currentStep > 5 ? 1 : currentStep;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      {/* Header Title (Compact) */}
      <div className="text-center max-w-3xl mx-auto space-y-0.5">
        <span className="text-[11px] uppercase font-extrabold tracking-wider text-teal-600">
          SAGARIKA ODICARE SERVICES • ONLINE BOOKING
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Reserve Your Home Cleaning Specialist
        </h1>
      </div>

      {/* Stepper Bar */}
      <BookingStepper currentStep={activeStep} setStep={setStep} />

      {/* Active Step Form Container (Compact & Wide) */}
      <div className="bg-slate-50/70 p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
        {activeStep === 1 && <ServiceSelector onNext={handleNextStep} />}
        {activeStep === 2 && <PropertyForm onNext={handleNextStep} onBack={handlePrevStep} />}
        {activeStep === 3 && <AddressForm onNext={handleNextStep} onBack={handlePrevStep} />}
        {activeStep === 4 && <SchedulePicker onNext={handleNextStep} onBack={handlePrevStep} />}
        {activeStep === 5 && <CustomerDetailsForm onNext={handleNextStep} onBack={handlePrevStep} />}
      </div>
    </div>
  );
};
