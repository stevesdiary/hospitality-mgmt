import { Router } from 'express';
import {
  initializePayment,
  verifyPayment,
  handleWebhook,
  getPaymentStatus,
} from '../controllers/paymentController';
import { authentication } from '../middleware/authentication';

const router = Router();

// Initialize payment (requires auth)
router.post('/initialize', authentication, initializePayment);

// Verify payment after callback (requires auth)
router.get('/verify/:reference', authentication, verifyPayment);

// Get payment status (requires auth)
router.get('/status/:reservationId', authentication, getPaymentStatus);

// Webhook (no auth — Paystack calls this directly, verified by signature)
router.post('/webhook', handleWebhook);

export default router;
