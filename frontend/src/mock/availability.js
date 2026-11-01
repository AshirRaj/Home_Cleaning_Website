export const MOCK_TIME_SLOTS = [
  { id: 'slot-1', label: '08:00 AM – 10:00 AM', available: true, badge: 'Early Bird' },
  { id: 'slot-2', label: '10:00 AM – 12:00 PM', available: true, badge: 'Popular' },
  { id: 'slot-3', label: '12:00 PM – 02:00 PM', available: true, badge: '' },
  { id: 'slot-4', label: '02:00 PM – 04:00 PM', available: true, badge: 'Popular' },
  { id: 'slot-5', label: '04:00 PM – 06:00 PM', available: true, badge: '' },
];

export const getAvailableDates = (daysAhead = 14) => {
  const dates = [];
  const today = new Date();
  
  for (let i = 0; i < daysAhead; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
    
    dates.push({
      dateStr,
      dayName: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNumber: d.getDate(),
      monthName: d.toLocaleDateString('en-US', { month: 'short' }),
      isWeekend,
      slots: MOCK_TIME_SLOTS.map((s, idx) => ({
        ...s,
        available: isWeekend && idx === 1 ? false : true,
      })),
    });
  }
  return dates;
};
