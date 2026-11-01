// Utility formatters for currency, date, time, and badges

export const formatCurrency = (amount) => {
  if (typeof amount !== 'number') return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
};

export const formatTimeSlot = (slot) => {
  return slot || 'Not scheduled';
};

export const getBookingStatusBadge = (status) => {
  switch (status?.toLowerCase()) {
    case 'confirmed':
      return { label: 'Confirmed', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: 'CheckCircle' };
    case 'in progress':
    case 'in_progress':
      return { label: 'In Progress', bg: 'bg-sky-50 text-sky-700 border-sky-200', icon: 'Clock' };
    case 'completed':
      return { label: 'Completed', bg: 'bg-teal-50 text-teal-800 border-teal-200', icon: 'ShieldCheck' };
    case 'cancelled':
      return { label: 'Cancelled', bg: 'bg-rose-50 text-rose-700 border-rose-200', icon: 'XCircle' };
    case 'pending':
    default:
      return { label: 'Pending', bg: 'bg-amber-50 text-amber-700 border-amber-200', icon: 'AlertCircle' };
  }
};

export const getPaymentStatusBadge = (status) => {
  switch (status?.toLowerCase()) {
    case 'paid':
      return { label: 'PAID', bg: 'bg-emerald-100 text-emerald-800 font-semibold' };
    case 'failed':
      return { label: 'FAILED', bg: 'bg-rose-100 text-rose-800 font-semibold' };
    case 'refunded':
      return { label: 'REFUNDED', bg: 'bg-purple-100 text-purple-800 font-semibold' };
    case 'pending':
    default:
      return { label: 'PENDING', bg: 'bg-amber-100 text-amber-800 font-semibold' };
  }
};

export const generateBookingId = () => {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `CLN-2026-${randomNum}`;
};
