import { useNavigate } from 'react-router-dom';
import { useBookingStore } from '../../store/bookingStore';
import { BookingStepper } from '../../components/booking/BookingStepper';
import { BookingSummary } from '../../components/booking/BookingSummary';

export const BookingReview = () => {
  const navigate = useNavigate();
  const { setStep } = useBookingStore();

  const handleProceedPayment = () => {
    setStep(7);
    navigate('/book/payment');
  };

  const handleSetStep = (stepNumber) => {
    setStep(stepNumber);
    navigate('/book');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <BookingStepper currentStep={6} setStep={handleSetStep} />

      <div className="bg-slate-50/60 p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
        <BookingSummary onProceedPayment={handleProceedPayment} setStep={handleSetStep} />
      </div>
    </div>
  );
};
