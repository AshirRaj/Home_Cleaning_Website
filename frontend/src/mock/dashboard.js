import { MOCK_BOOKINGS } from './bookings';

export const getMockDashboardStats = () => {
  const totalBookings = MOCK_BOOKINGS.length;
  const todayBookings = MOCK_BOOKINGS.filter((b) => b.schedule.date === '2026-08-25').length;
  const pendingPayments = MOCK_BOOKINGS.filter((b) => b.payment.status === 'Pending').length;
  const paidBookings = MOCK_BOOKINGS.filter((b) => b.payment.status === 'Paid').length;
  const completedBookings = MOCK_BOOKINGS.filter((b) => b.status === 'Completed').length;
  const cancelledBookings = MOCK_BOOKINGS.filter((b) => b.status === 'Cancelled').length;

  const totalRevenue = MOCK_BOOKINGS.reduce((sum, b) => (b.payment.status === 'Paid' ? sum + b.pricing.total : sum), 0);

  return {
    totalBookings,
    todayBookings,
    pendingPayments,
    paidBookings,
    completedBookings,
    cancelledBookings,
    totalRevenue,
    monthlyTarget: 500000,
    targetProgress: 68,
  };
};
