import { Router } from 'express';
import {
  getServices,
  getAdminServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from '../controllers/serviceController.js';
import { authenticateAdmin } from '../middleware/authMiddleware.js';

const router = Router();

// Public routes under /api/services
router.get('/', getServices);
router.get('/:id', getServiceById);

// Admin routes under /api/admin/services
export const adminServiceRouter = Router();
adminServiceRouter.use(authenticateAdmin);
adminServiceRouter.get('/', getAdminServices);
adminServiceRouter.post('/', createService);
adminServiceRouter.put('/:id', updateService);
adminServiceRouter.delete('/:id', deleteService);

export default router;
