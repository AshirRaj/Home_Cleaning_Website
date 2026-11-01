import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBookingStore } from '../../store/bookingStore';
import { useCreateBooking } from '../../hooks/useBooking';
import { useVerifyPayment, useCreatePaymentOrder } from '../../hooks/usePayment';
import { BookingStepper } from '../../components/booking/BookingStepper';
import { PriceBreakdown } from '../../components/booking/PriceBreakdown';
import { Button } from '../../components/common/Button';
import { formatCurrency, generateBookingId } from '../../utils/formatters';
import {
  CreditCard,
  QrCode,
  Building2,
  Wallet,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Banknote,
} from 'lucide-react';
import { motion } from 'framer-motion';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const Payment = () => {
  const navigate = useNavigate();
  const { bookingState, pricing, selectedServices, setBookingId, updatePayment } = useBookingStore();
  const createBookingMutation = useCreateBooking();
  const createPaymentOrderMutation = useCreatePaymentOrder();
  const verifyPaymentMutation = useVerifyPayment();

  const [paymentMethod, setPaymentMethod] = useState('PayAfterService');
  const [cardNumber, setCardNumber] = useState('4111 2222 3333 4444');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const consolidatedServiceName =
    selectedServices && selectedServices.length > 0
      ? selectedServices.map((s) => s.name).join(' + ')
      : bookingState.service?.name || 'Home Cleaning Service';

  // Confirm booking with Pay After Service (No payment required now)
  const handlePayAfterServiceConfirm = async () => {
    try {
      setIsProcessing(true);
      setErrorMessage('');

      const generatedId = generateBookingId();

      const finalBookingObj = {
        id: generatedId,
        customer: bookingState.customer,
        service: {
          id: selectedServices[0]?.id || bookingState.service?.id,
          name: consolidatedServiceName,
        },
        services: selectedServices,
        property: bookingState.property,
        address: bookingState.address,
        schedule: bookingState.schedule,
        addons: bookingState.selectedAddons,
        pricing: {
          basePrice: pricing.basePrice,
          subtotal: pricing.subtotal,
          tax: pricing.tax,
          total: pricing.total,
        },
        payment: {
          method: 'Pay After Service (Cash / UPI upon completion)',
          transactionId: `PAY_AFTER_WORK_${Date.now()}`,
          status: 'Pending (Pay After Work)',
          paidAt: null,
        },
        status: 'Confirmed',
        notes: `Customer booked ${selectedServices.length} service(s): ${consolidatedServiceName}. Opted for Pay After Cleaning Service Completion.`,
      };

      await createBookingMutation.mutateAsync(finalBookingObj);

      setBookingId(generatedId);
      updatePayment({
        method: 'Pay After Service',
        transactionId: `PAY_AFTER_WORK_${Date.now()}`,
        status: 'Pending (Pay After Work)',
      });

      navigate('/book/success', { state: { booking: finalBookingObj } });
    } catch (err) {
      console.error('Booking error:', err);
      setErrorMessage(err.message || 'Failed to confirm booking. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Online Payment flow (Razorpay Test Mode)
  const handlePayAndConfirm = async () => {
    try {
      setIsProcessing(true);
      setErrorMessage('');

      // 1. Load Razorpay Checkout Script
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error('Razorpay SDK failed to load. Please check your internet connection.');
      }

      const generatedId = generateBookingId();

      // 2. Create Razorpay Order on Backend
      const orderRes = await createPaymentOrderMutation.mutateAsync({
        amount: pricing.total,
        bookingId: generatedId,
        currency: 'INR',
      });

      const orderId = orderRes.orderId || orderRes.order?.id;
      const keyId = orderRes.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID;

      if (!orderId) {
        throw new Error('Failed to obtain Razorpay Order ID from server.');
      }

      // 3. Configure Razorpay Checkout Modal Options
      const options = {
        key: keyId,
        amount: orderRes.order?.amount || Math.round(pricing.total * 100),
        currency: orderRes.currency || 'INR',
        name: 'Sagarika Cleaning',
        description: `Booking #${generatedId} – ${consolidatedServiceName}`,
        order_id: orderId,
        prefill: {
          name: bookingState.customer?.fullName || '',
          email: bookingState.customer?.email || '',
          contact: bookingState.customer?.phone || '',
        },
        notes: {
          bookingId: generatedId,
        },
        theme: {
          color: '#0d9488',
        },
        handler: async (response) => {
          try {
            console.log('[Razorpay Payment Response Received]:', response);

            // 4. Backend Signature Verification
            const verifyRes = await verifyPaymentMutation.mutateAsync({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId: generatedId,
            });

            if (!verifyRes.success && verifyRes.status !== 'Paid') {
              throw new Error('Payment signature verification failed.');
            }

            // 5. Create Verified Paid Booking in DB
            const finalBookingObj = {
              id: generatedId,
              customer: bookingState.customer,
              service: {
                id: selectedServices[0]?.id || bookingState.service?.id,
                name: consolidatedServiceName,
              },
              services: selectedServices,
              property: bookingState.property,
              address: bookingState.address,
              schedule: bookingState.schedule,
              addons: bookingState.selectedAddons,
              pricing: {
                basePrice: pricing.basePrice,
                subtotal: pricing.subtotal,
                tax: pricing.tax,
                total: pricing.total,
              },
              payment: {
                method: paymentMethod,
                transactionId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                status: 'Paid',
                paidAt: new Date().toISOString(),
              },
              status: 'Confirmed',
              notes: `Customer booked ${selectedServices.length} service(s): ${consolidatedServiceName}. Verified via Razorpay Online Payment.`,
            };

            await createBookingMutation.mutateAsync(finalBookingObj);

            setBookingId(generatedId);
            updatePayment({
              method: paymentMethod,
              transactionId: response.razorpay_payment_id,
              status: 'Paid',
            });

            navigate('/book/success', { state: { booking: finalBookingObj } });
          } catch (err) {
            console.error('Payment processing error:', err);
            console.error('Status:', err.response?.status);
            console.error('Response:', err.response?.data);
            setErrorMessage(err.response?.data?.message || err.message || 'Payment verification failed. Please try again.');
          } finally {
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: () => {
            console.log('[Razorpay Checkout]: Customer closed modal window without completing payment.');
            setIsProcessing(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (resp) {
        console.error('[Razorpay Payment Failed]:', resp.error);
        setErrorMessage(`Payment failed: ${resp.error?.description || resp.error?.reason || 'Authorization declined.'}`);
        setIsProcessing(false);
      });
      rzp.open();
    } catch (err) {
      console.error('Payment processing error:', err);
      console.error('Status:', err.response?.status);
      console.error('Response:', err.response?.data);
      setErrorMessage(err.response?.data?.message || err.message || 'Failed to initiate Razorpay payment order.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <BookingStepper currentStep={7} setStep={() => {}} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Col: Payment Method Portal */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Choose Payment Method</h2>
              <p className="text-xs text-slate-500">Pay after work completion or online via UPI/Card</p>
            </div>
            <div className="flex items-center gap-1 text-emerald-600 font-bold text-xs bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" /> Guaranteed Service
            </div>
          </div>

          {/* Payment Method Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {[
              { id: 'PayAfterService', label: 'Pay After Service', icon: Banknote, badge: 'Popular' },
              { id: 'UPI', label: 'UPI / QR', icon: QrCode },
              { id: 'Card', label: 'Credit/Debit', icon: CreditCard },
              { id: 'NetBanking', label: 'Net Banking', icon: Building2 },
              { id: 'Wallet', label: 'Wallets', icon: Wallet },
            ].map((method) => {
              const Icon = method.icon;
              const isSelected = paymentMethod === method.id;
              return (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setPaymentMethod(method.id)}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 cursor-pointer relative ${
                    isSelected
                      ? 'border-teal-600 bg-teal-50 text-teal-950 font-bold ring-2 ring-teal-600/20 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300 text-slate-600'
                  }`}
                >
                  {method.badge && (
                    <span className="absolute -top-2 bg-emerald-600 text-white text-[9px] font-extrabold px-2 py-0.2 rounded-full uppercase">
                      {method.badge}
                    </span>
                  )}
                  <Icon className={`w-5 h-5 ${isSelected ? 'text-teal-600' : 'text-slate-400'}`} />
                  <span className="text-[11px] leading-tight">{method.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Form Content */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
            {paymentMethod === 'PayAfterService' && (
              <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl space-y-2 text-emerald-950">
                  <div className="flex items-center gap-2 font-bold text-sm text-emerald-800">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>No Payment Required Right Now!</span>
                  </div>
                  <p className="text-xs text-emerald-900 leading-relaxed">
                    Book your cleaning service now without paying any upfront money. Inspect the work when our team finishes, then pay cash or scan UPI directly to the team leader.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-2">
                  <span className="font-bold text-slate-900 block">After Service Completion Payment Options:</span>
                  <div className="flex flex-wrap gap-2 text-teal-800 font-semibold">
                    <span className="bg-teal-50 px-2.5 py-1 rounded-md border border-teal-100">💵 Cash to Team Leader</span>
                    <span className="bg-teal-50 px-2.5 py-1 rounded-md border border-teal-100">📲 UPI Scan on Site</span>
                  </div>
                </div>
              </motion.div>
            )}

            {paymentMethod === 'UPI' && (
              <div className="space-y-4 text-center sm:text-left">
                <p className="text-xs font-bold text-slate-700">Scan QR or enter VPA address:</p>
                <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-xl border border-slate-200">
                  <div className="w-24 h-24 bg-slate-900 text-white rounded-lg flex items-center justify-center p-2 shrink-0">
                    <QrCode className="w-16 h-16 text-teal-400" />
                  </div>
                  <div className="space-y-1 text-xs text-slate-600">
                    <p className="font-bold text-slate-900">Scan with any UPI app</p>
                    <p>GPay, PhonePe, Paytm, BHIM</p>
                    <p className="text-teal-700 font-semibold pt-1">UPI ID: sagarika@upi</p>
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'Card' && (
              <div className="space-y-3">
                <p className="text-xs font-bold text-slate-700">Enter Card Information:</p>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="Card Number"
                  className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs focus:ring-2 focus:ring-teal-500 font-mono"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="MM / YY"
                    className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs focus:ring-2 focus:ring-teal-500"
                  />
                  <input
                    type="password"
                    placeholder="CVV"
                    maxLength={4}
                    className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
            )}

            {paymentMethod === 'NetBanking' && (
              <div className="space-y-2 text-xs text-slate-600">
                <p className="font-bold text-slate-900">Select Popular Bank:</p>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {['HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank'].map((b) => (
                    <label key={b} className="p-2.5 bg-white border border-slate-200 rounded-lg flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="bank" defaultChecked={b === 'HDFC Bank'} className="text-teal-600" />
                      <span className="font-semibold text-slate-800">{b}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {paymentMethod === 'Wallet' && (
              <div className="text-xs text-slate-600 space-y-1">
                <p className="font-bold text-slate-900">Supported Wallets:</p>
                <p>Paytm Wallet, PhonePe Wallet, Amazon Pay</p>
              </div>
            )}
          </div>

          {errorMessage && (
            <div className="flex items-center gap-2 text-xs text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-200 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Action Button */}
          {paymentMethod === 'PayAfterService' ? (
            <Button
              variant="primary"
              size="lg"
              className="w-full py-4 text-base shadow-xl shadow-teal-600/30 bg-emerald-600 hover:bg-emerald-700 border-emerald-600"
              isLoading={isProcessing}
              isDisabled={isProcessing}
              onClick={handlePayAfterServiceConfirm}
            >
              {isProcessing ? 'Confirming Your Booking...' : 'Confirm Booking — Pay After Service Completion ✓'}
            </Button>
          ) : (
            <Button
              variant="primary"
              size="lg"
              className="w-full py-4 text-base shadow-xl shadow-teal-600/30"
              isLoading={isProcessing}
              isDisabled={isProcessing}
              onClick={handlePayAndConfirm}
            >
              {isProcessing ? 'Processing Online Payment...' : `Pay ${formatCurrency(pricing.total)} & Confirm Booking`}
            </Button>
          )}

          <div className="flex items-center justify-center gap-2 text-xs text-slate-400 pt-2">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>SAGARIKA ODICARE SERVICES • Verified Booking</span>
          </div>
        </div>

        {/* Right Col: Summary */}
        <div className="lg:col-span-5 space-y-6">
          <PriceBreakdown
            pricing={pricing}
            selectedAddons={bookingState.selectedAddons}
          />
        </div>
      </div>
    </div>
  );
};
