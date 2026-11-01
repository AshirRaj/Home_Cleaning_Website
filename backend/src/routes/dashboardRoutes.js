import { Router } from 'express';
import {
  getStats,
  getRecentBookings,
  getNotifications,
  markNotificationsRead,
} from '../controllers/dashboardController.js';
import { authenticateAdmin } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/stats', authenticateAdmin, getStats);
router.get('/recent-bookings', authenticateAdmin, getRecentBookings);
router.get('/notifications', authenticateAdmin, getNotifications);
router.patch('/notifications/mark-read', authenticateAdmin, markNotificationsRead);

export default router;
