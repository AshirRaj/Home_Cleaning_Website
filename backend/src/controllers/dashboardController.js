import { Booking } from '../models/Booking.js';
import { Notification } from '../models/Notification.js';

let readNotificationIds = new Set();

export const getStats = async (req, res, next) => {
  try {
    const totalBookings = await Booking.countDocuments();

    const todayStr = new Date().toISOString().split('T')[0];
    const todayBookings = await Booking.countDocuments({
      'schedule.date': todayStr,
    });

    const pendingBookings = await Booking.countDocuments({ status: 'Pending' });
    const confirmedBookings = await Booking.countDocuments({ status: 'Confirmed' });
    const completedBookings = await Booking.countDocuments({ status: 'Completed' });
    const cancelledBookings = await Booking.countDocuments({ status: 'Cancelled' });

    // Aggregate revenues
    const paidAggregation = await Booking.aggregate([
      { $match: { 'payment.status': 'Paid' } },
      { $group: { _id: null, total: { $sum: '$pricing.total' } } },
    ]);
    const paidRevenue = paidAggregation[0]?.total || 0;

    const pendingAggregation = await Booking.aggregate([
      { $match: { 'payment.status': 'Pending' } },
      { $group: { _id: null, total: { $sum: '$pricing.total' } } },
    ]);
    const pendingPayments = pendingAggregation[0]?.total || 0;

    const totalRevenue = paidRevenue + pendingPayments;

    const avgBookingValue = totalBookings > 0 ? Math.round(totalRevenue / totalBookings) : 0;
    const completionRate = totalBookings > 0 ? Number(((completedBookings / totalBookings) * 100).toFixed(1)) : 0;

    return res.status(200).json({
      totalBookings,
      todayBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
      totalRevenue,
      paidRevenue,
      pendingPayments,
      avgBookingValue,
      completionRate,
    });
  } catch (error) {
    next(error);
  }
};

export const getRecentBookings = async (req, res, next) => {
  try {
    const limit = Number(req.query.limit) || 5;
    const recent = await Booking.find().sort({ createdAt: -1 }).limit(limit);
    return res.status(200).json(recent);
  } catch (error) {
    next(error);
  }
};

export const getNotifications = async (req, res, next) => {
  try {
    const limit = Number(req.query.limit) || 15;

    // 1. Fetch System Notifications (Email & WhatsApp attempts)
    const dbNotifs = await Notification.find().sort({ createdAt: -1 }).limit(limit);

    // 2. Fetch Recent Customer Bookings (New Reservation Alerts)
    const recentBookings = await Booking.find().sort({ createdAt: -1 }).limit(limit);

    const formattedDbNotifs = dbNotifs.map((n) => ({
      id: String(n._id),
      bookingId: n.bookingId,
      title: n.channel === 'EMAIL' ? 'Email Confirmation Sent' : 'WhatsApp Notification Triggered',
      message: `Recipient: ${n.recipient} (${n.type})`,
      type: n.channel,
      status: n.status,
      createdAt: n.createdAt,
      read: readNotificationIds.has(String(n._id)),
    }));

    const formattedBookingNotifs = recentBookings.map((b) => {
      const idStr = `BK_NOTIF_${b.bookingId || b.id}`;
      return {
        id: idStr,
        bookingId: b.bookingId || b.id,
        title: `New Reservation #${b.bookingId || b.id}`,
        message: `${b.customer?.fullName || 'Customer'} booked ${b.service?.name || 'Cleaning Service'} (₹${b.pricing?.total || 0})`,
        type: 'BOOKING',
        status: b.status || 'Pending',
        createdAt: b.createdAt,
        read: readNotificationIds.has(idStr),
      };
    });

    // Merge and sort chronologically
    const allNotifications = [...formattedBookingNotifs, ...formattedDbNotifs]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);

    const unreadCount = allNotifications.filter((n) => !n.read).length;

    return res.status(200).json({
      success: true,
      unreadCount,
      notifications: allNotifications,
    });
  } catch (error) {
    next(error);
  }
};

export const markNotificationsRead = async (req, res, next) => {
  try {
    const { notificationIds } = req.body;
    if (Array.isArray(notificationIds)) {
      notificationIds.forEach((id) => readNotificationIds.add(id));
    } else {
      // Mark all read
      const limit = 20;
      const dbNotifs = await Notification.find().sort({ createdAt: -1 }).limit(limit);
      const recentBookings = await Booking.find().sort({ createdAt: -1 }).limit(limit);
      dbNotifs.forEach((n) => readNotificationIds.add(String(n._id)));
      recentBookings.forEach((b) => readNotificationIds.add(`BK_NOTIF_${b.bookingId || b.id}`));
    }

    return res.status(200).json({
      success: true,
      message: 'Notifications marked as read.',
    });
  } catch (error) {
    next(error);
  }
};
