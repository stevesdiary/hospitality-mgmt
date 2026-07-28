import { Router } from 'express';
import {
  initializePayment,
  verifyPayment,
  paystackWebhook,
  listPayments,
  getPayment,
} from '../controllers/paymentController';
import { authentication } from '../middleware/authentication';
import verifyUserType from '../middleware/verifyUserType';

const router = Router();

// ── Public (guest checkout has no account) ─────────────────────────────────
// The booking reference / payment reference act as the capability here; the
// charge amount is always computed server-side from the reservation.
router.post('/payments/initialize', initializePayment);
router.get('/payments/verify/:reference', verifyPayment);

// Paystack webhook — authenticated by HMAC signature, not by a session.
router.post('/payments/webhook', paystackWebhook);

// ── Staff ──────────────────────────────────────────────────────────────────
router.get('/payments', authentication, verifyUserType(['admin', 'org_admin']), listPayments);
router.get('/payments/:id', authentication, verifyUserType(['admin', 'org_admin']), getPayment);

export default router;
