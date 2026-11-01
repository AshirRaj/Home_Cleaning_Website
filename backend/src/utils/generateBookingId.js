export const generateBookingId = (counter = Math.floor(Math.random() * 90000) + 10000) => {
  const year = new Date().getFullYear();
  const padCounter = String(counter).padStart(5, '0');
  return `CLN-${year}-${padCounter}`;
};
