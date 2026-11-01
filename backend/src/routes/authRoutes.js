import { Router } from 'express';
import { login, logout, getCurrentAdmin, changePassword } from '../controllers/authController.js';
import { authenticateAdmin } from '../middleware/authMiddleware.js';
import { loginLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/login', loginLimiter, login);
router.post('/logout', logout);
router.get('/me', authenticateAdmin, getCurrentAdmin);
router.post('/change-password', changePassword);

export default router;
