import { getBookingStatusBadge, getPaymentStatusBadge } from '../../utils/formatters';

export const BookingStatusBadge = ({ status }) => {
  const badge = getBookingStatusBadge(status);
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${badge.bg}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      <span>{badge.label}</span>
    </span>
  );
};

export const PaymentStatusBadge = ({ status }) => {
  const badge = getPaymentStatusBadge(status);
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] tracking-wide ${badge.bg}`}>
      {badge.label}
    </span>
  );
};
