import { Router } from 'express';
import { createOrder, verifyPayment, getPaymentStatus, handleWebhook } from '../controllers/paymentController.js';

const router = Router();

router.post('/create-order', createOrder);
router.post('/verify', verifyPayment);
router.get('/:id', getPaymentStatus);
router.post('/webhook', handleWebhook);

export default router;
