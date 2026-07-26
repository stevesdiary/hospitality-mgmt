/**
 * Payment Controller (Paystack)
 */

import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Payment, Reservation, Hotel, sequelize } from '../models';
import {
  computeAmountKobo,
  initializeTransaction,
  verifyTransaction,
  isValidWebhookSignature,
  buildPaymentReference,
} from '../services/paymentService';

const canAccessPayment = (req: Request, payment: any): boolean => {
  const user = req.user;
  if (!user) return false;
  if (user.type === 'admin') return true;
  return !!user.companyId && payment.companyId === user.companyId;
};

/**
 * Record a successful payment against its reservation. Shared by the callback
 * verify and the webhook, and safe to run more than once — whichever arrives
 * first wins and the second is a no-op.
 */
const applySuccessfulPayment = async (
  payment: any,
  details: { amountKobo: number; channel?: string; paidAt?: Date }
): Promise<void> => {
  if (payment.status === 'success') return; // already settled

  // Guard against an underpayment being treated as settlement.
  if (details.amountKobo < Number(payment.amount)) {
    await payment.update({ status: 'failed' });
    return;
  }

  await sequelize.transaction(async (t) => {
    await payment.update(
      { status: 'success', channel: details.channel, paidAt: details.paidAt ?? new Date() },
      { transaction: t }
    );

    const reservation = await Reservation.findByPk(payment.reservationId, { transaction: t });
    if (reservation) {
      // Paying confirms the booking; leave later states (checked-in etc.) alone.
      const next = (reservation as any).status === 'pending' ? 'confirmed' : (reservation as any).status;
      await reservation.update({ paymentStatus: true, status: next }, { transaction: t });
    }
  });
};

/**
 * Start a payment for a booking and return Paystack's hosted checkout URL.
 *
 * Public: guest bookings have no account, so the booking reference acts as the
 * capability to pay for that booking. The amount is always computed server-side.
 */
export const initializePayment = async (req: Request, res: Response): Promise<any> => {
  try {
    const { bookingReference, reservationId, callbackUrl } = req.body;
    if (!bookingReference && !reservationId) {
      return res.status(400).json({ message: 'bookingReference or reservationId is required' });
    }

    const reservation: any = bookingReference
      ? await Reservation.findOne({ where: { bookingReference } })
      : await Reservation.findByPk(reservationId);

    if (!reservation) return res.status(404).json({ message: 'Booking not found' });
    if (reservation.paymentStatus === true) {
      return res.status(409).json({ message: 'This booking has already been paid for' });
    }
    if (reservation.status === 'cancelled') {
      return res.status(409).json({ message: 'This booking has been cancelled' });
    }

    const email = reservation.guestEmail || req.user?.email;
    if (!email) {
      return res.status(400).json({ message: 'No email on this booking to send the receipt to' });
    }

    // Authoritative amount — derived from the room price, not the request.
    const amountKobo = await computeAmountKobo(reservation);
    const reference = buildPaymentReference(reservation.bookingReference);

    const payment = await Payment.create({
      id: uuidv4(),
      reservationId: reservation.id,
      companyId: reservation.companyId,
      reference,
      amount: amountKobo,
      currency: 'NGN',
      status: 'pending',
      email,
    });

    try {
      const init = await initializeTransaction({
        email,
        amountKobo,
        reference,
        callbackUrl,
        metadata: { reservationId: reservation.id, bookingReference: reservation.bookingReference },
      });

      return res.status(201).json({
        message: 'Payment initialized',
        authorizationUrl: init.authorizationUrl,
        reference,
        amount: amountKobo,
        currency: 'NGN',
      });
    } catch (err: any) {
      // Don't leave a dangling "pending" row if the provider rejected us.
      await payment.update({ status: 'failed' });
      return res.status(502).json({ message: err.message || 'Could not start the payment' });
    }
  } catch (err: any) {
    return res.status(500).json({ message: 'Failed to initialize payment', error: err.message });
  }
};

/**
 * Verify a transaction (called when the guest returns from Paystack).
 * Public — the reference is unguessable and only reveals its own status.
 */
export const verifyPayment = async (req: Request, res: Response): Promise<any> => {
  try {
    const { reference } = req.params;
    const payment: any = await Payment.findOne({ where: { reference } });
    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    if (payment.status === 'success') {
      return res.status(200).json({ message: 'Payment already confirmed', status: 'success', reference });
    }

    const result = await verifyTransaction(reference);

    if (result.status === 'success') {
      await applySuccessfulPayment(payment, {
        amountKobo: result.amountKobo,
        channel: result.channel,
        paidAt: result.paidAt,
      });
      // Re-read: applySuccessfulPayment marks it failed on underpayment.
      await payment.reload();
      return res.status(200).json({
        message: payment.status === 'success' ? 'Payment confirmed' : 'Payment amount did not match',
        status: payment.status,
        reference,
      });
    }

    await payment.update({ status: result.status === 'pending' ? 'pending' : result.status });
    return res.status(200).json({ message: 'Payment not completed', status: result.status, reference });
  } catch (err: any) {
    return res.status(500).json({ message: 'Failed to verify payment', error: err.message });
  }
};

/**
 * Paystack webhook — the authoritative settlement signal, since a guest may
 * close the browser before returning. Only acted on after HMAC verification.
 */
export const paystackWebhook = async (req: Request, res: Response): Promise<any> => {
  const signature = req.headers['x-paystack-signature'] as string | undefined;

  if (!isValidWebhookSignature((req as any).rawBody, signature)) {
    return res.status(401).json({ message: 'Invalid signature' });
  }

  // Acknowledge immediately; Paystack retries on non-2xx.
  res.status(200).json({ received: true });

  try {
    const event = req.body;
    if (event?.event !== 'charge.success') return;

    const reference = event?.data?.reference;
    if (!reference) return;

    const payment: any = await Payment.findOne({ where: { reference } });
    if (!payment) return;

    await applySuccessfulPayment(payment, {
      amountKobo: Number(event.data.amount) || 0,
      channel: event.data.channel,
      paidAt: event.data.paid_at ? new Date(event.data.paid_at) : undefined,
    });
  } catch (err: any) {
    // Response already sent; log for follow-up rather than failing the webhook.
    console.error('Webhook processing error:', err.message);
  }
};

/** Payments for the caller's tenant (platform admin sees all). */
export const listPayments = async (req: Request, res: Response): Promise<any> => {
  try {
    const user = req.user;
    const where: any = {};
    if (user?.type !== 'admin') {
      if (!user?.companyId) return res.status(200).json({ message: 'Payments retrieved', Count: 0, Payments: [] });
      where.companyId = user.companyId;
    }

    const { count, rows } = await Payment.findAndCountAll({
      where,
      include: [{ model: Reservation, as: 'Reservation', include: [{ model: Hotel, as: 'Hotel' }] }],
      order: [['createdAt', 'DESC']],
    });
    return res.status(200).json({ message: 'Payments retrieved', Count: count, Payments: rows });
  } catch (err: any) {
    return res.status(500).json({ message: 'Failed to retrieve payments', error: err.message });
  }
};

/** A single payment, tenant-scoped. */
export const getPayment = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const payment: any = await Payment.findByPk(id);
    if (!payment || !canAccessPayment(req, payment)) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    return res.status(200).json({ message: 'Payment retrieved', payment });
  } catch (err: any) {
    return res.status(500).json({ message: 'Failed to retrieve payment', error: err.message });
  }
};
