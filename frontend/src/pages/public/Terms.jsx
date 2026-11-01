export const Terms = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-6 text-slate-800">
      <h1 className="text-3xl font-extrabold text-slate-900">Terms and Conditions</h1>
      <p className="text-xs text-slate-400">Last updated: August 25, 2026</p>

      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs leading-relaxed text-slate-600">
        <h2 className="text-base font-bold text-slate-900">1. Booking Agreement</h2>
        <p>
          By submitting a service booking on SparkleClean, you agree to provide accurate location details and ensure active electricity and running water are available at the service site during the scheduled time slot.
        </p>

        <h2 className="text-base font-bold text-slate-900">2. Cancellation & Rescheduling</h2>
        <p>
          Bookings can be rescheduled or cancelled free of charge up to 4 hours before the designated arrival window. Cancellations within 4 hours may incur a nominal dispatch charge.
        </p>

        <h2 className="text-base font-bold text-slate-900">3. Satisfaction Guarantee</h2>
        <p>
          If you are unsatisfied with any portion of your cleaning service, you must report it within 24 hours of completion. We will inspect and provide a free re-cleaning of the reported area.
        </p>
      </div>
    </div>
  );
};
