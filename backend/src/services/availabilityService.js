import { Booking } from '../models/Booking.js';

const TIME_SLOTS_DEF = [
  { id: 'slot-1', label: '08:00 AM – 10:00 AM', badge: 'Early Bird' },
  { id: 'slot-2', label: '10:00 AM – 12:00 PM', badge: 'Popular' },
  { id: 'slot-3', label: '12:00 PM – 02:00 PM', badge: '' },
  { id: 'slot-4', label: '02:00 PM – 04:00 PM', badge: 'Popular' },
  { id: 'slot-5', label: '04:00 PM – 06:00 PM', badge: '' },
];

const MAX_BOOKINGS_PER_SLOT = 3;

export const getAvailabilityService = async (days = 14) => {
  const dates = [];
  const today = new Date();

  // Fetch all active bookings in next `days` days from DB
  const startDate = today.toISOString().split('T')[0];
  const endDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  let activeBookings = [];
  try {
    activeBookings = await Booking.find({
      'schedule.date': { $gte: startDate, $lte: endDate },
      status: { $ne: 'Cancelled' },
    }).select('schedule.date schedule.timeSlot');
  } catch (err) {
    activeBookings = [];
  }

  // Count bookings per date & timeSlot
  const countsMap = {};
  activeBookings.forEach((b) => {
    const key = `${b.schedule?.date}_${b.schedule?.timeSlot}`;
    countsMap[key] = (countsMap[key] || 0) + 1;
  });

  for (let i = 0; i < days; i++) {
    const d = new Date(today.getTime() + i * 24 * 60 * 60 * 1000);
    const dateStr = d.toISOString().split('T')[0];
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;

    const slots = TIME_SLOTS_DEF.map((slotDef) => {
      const bookedCount = countsMap[`${dateStr}_${slotDef.label}`] || countsMap[`${dateStr}_${slotDef.id}`] || 0;
      const isAvailable = bookedCount < MAX_BOOKINGS_PER_SLOT;
      return {
        id: slotDef.id,
        label: slotDef.label,
        timeSlot: slotDef.label,
        available: isAvailable,
        badge: slotDef.badge || '',
        capacityRemaining: Math.max(0, MAX_BOOKINGS_PER_SLOT - bookedCount),
      };
    });

    dates.push({
      dateStr,
      date: dateStr,
      dayName: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNumber: d.getDate(),
      monthName: d.toLocaleDateString('en-US', { month: 'short' }),
      formattedDate: d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
      isWeekend,
      availableSlotsCount: slots.filter((s) => s.available).length,
      slots,
    });
  }

  return dates;
};

export const checkSlotAvailable = async (dateStr, timeSlot) => {
  try {
    const count = await Booking.countDocuments({
      'schedule.date': dateStr,
      $or: [{ 'schedule.timeSlot': timeSlot }, { 'schedule.timeSlot': { $regex: timeSlot, $options: 'i' } }],
      status: { $ne: 'Cancelled' },
    });
    return count < MAX_BOOKINGS_PER_SLOT;
  } catch (e) {
    return true;
  }
};
