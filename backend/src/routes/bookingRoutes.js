import { Router } from 'express';
import {
  createBooking,
  getAvailability,
  getBookingById,
  getAdminBookings,
  updateBookingStatus,
  updatePaymentStatus,
  addBookingNote,
  deleteBooking,
} from '../controllers/bookingController.js';
import { authenticateAdmin } from '../middleware/authMiddleware.js';

const router = Router();

// Public Booking routes
router.post('/bookings', createBooking);
router.get('/bookings/availability', getAvailability);
router.get('/bookings/:id', getBookingById);

// Admin Booking routes
router.get('/admin/bookings', authenticateAdmin, getAdminBookings);
router.get('/admin/bookings/:id', authenticateAdmin, getBookingById);
router.patch('/admin/bookings/:id/status', authenticateAdmin, updateBookingStatus);
router.patch('/admin/bookings/:id/status/payment', authenticateAdmin, updatePaymentStatus);
router.patch('/admin/bookings/:id', authenticateAdmin, updateBookingStatus);
router.post('/admin/bookings/:id/notes', authenticateAdmin, addBookingNote);
router.delete('/admin/bookings/:id', authenticateAdmin, deleteBooking);

export default router;
