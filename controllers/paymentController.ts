/**
 * Payment Controller
 * Handles Paystack payment initialization, verification, and webhooks
 */

import { Request, Response } from 'express';
import { Reservation, Room, User } from '../models';
import paystackService from '../services/paystackService';

/**
 * Initialize payment for a reservation
 * POST /payments/initialize
 */
export const initializePayment = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { reservationId } = req.body;
    if (!reservationId) return res.status(400).json({ message: 'reservationId is required' });

    const reservation = await Reservation.findByPk(reservationId, {
      include: [{ model: Room, as: 'Room' }],
    });

    if (!reservation) return res.status(404).json({ message: 'Reservation not found' });
    if (reservation.userId !== userId) return res.status(403).json({ message: 'Forbidden' });
    if (reservation.paymentStatus === 'paid') {
      return res.status(400).json({ message: 'Reservation is already paid' });
    }

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Calculate total price
    const room = reservation.Room as any;
    const dateIn = new Date(reservation.dateIn);
    const dateOut = new Date(reservation.dateOut);
    const nights = Math.ceil((dateOut.getTime() - dateIn.getTime()) / (1000 * 60 * 60 * 24));
    const totalPrice = room.price * nights;

    const reference = paystackService.generateReference('RES');
    const amountInKobo = paystackService.toKobo(totalPrice);

    const callbackUrl = process.env.PAYSTACK_CALLBACK_URL || `${process.env.PUBLIC_URL}/payment/callback`;

    const response = await paystackService.initializeTransaction(
      user.email,
      amountInKobo,
      reference,
      {
        reservationId: reservation.id,
        userId,
        hotelId: reservation.hotelId,
        roomId: reservation.roomId,
      },
      callbackUrl
    );

    // Store reference on reservation for later verification
    await Reservation.update(
      { paymentReference: reference, totalPrice },
      { where: { id: reservationId } }
    );

    return res.status(200).json({
      message: 'Payment initialized',
      authorizationUrl: response.data.authorization_url,
      accessCode: response.data.access_code,
      reference: response.data.reference,
      amount: totalPrice,
    });
  } catch (err: any) {
    console.error('Payment initialization error:', err);
    return res.status(500).json({ message: 'Failed to initialize payment', error: err.message });
  }
};

/**
 * Verify payment after callback
 * GET /payments/verify/:reference
 */
export const verifyPayment = async (req: Request, res: Response): Promise<any> => {
  try {
    const { reference } = req.params;
    if (!reference) return res.status(400).json({ message: 'Reference is required' });

    const response = await paystackService.verifyTransaction(reference);

    if (response.data.status === 'success') {
      const { reservationId } = response.data.metadata;

      await Reservation.update(
        { paymentStatus: 'paid', status: 'confirmed' },
        { where: { id: reservationId } }
      );

      return res.status(200).json({
        message: 'Payment verified successfully',
        status: 'success',
        reservationId,
        amount: paystackService.toNaira(response.data.amount),
        paidAt: response.data.paid_at,
      });
    } else {
      return res.status(400).json({
        message: 'Payment verification failed',
        status: response.data.status,
      });
    }
  } catch (err: any) {
    console.error('Payment verification error:', err);
    return res.status(500).json({ message: 'Failed to verify payment', error: err.message });
  }
};

/**
 * Paystack webhook handler
 * POST /payments/webhook
 */
export const handleWebhook = async (req: Request, res: Response): Promise<any> => {
  try {
    const signature = req.headers['x-paystack-signature'] as string;
    const payload = JSON.stringify(req.body);

    // Verify webhook signature
    if (!paystackService.verifyWebhookSignature(payload, signature)) {
      return res.status(401).json({ message: 'Invalid signature' });
    }

    const event = req.body;

    switch (event.event) {
      case 'charge.success': {
        const { reference, metadata } = event.data;
        const { reservationId } = metadata || {};

        if (reservationId) {
          await Reservation.update(
            { paymentStatus: 'paid', status: 'confirmed' },
            { where: { id: reservationId } }
          );
          console.log(`Payment confirmed for reservation ${reservationId}`);
        }
        break;
      }

      case 'charge.failed': {
        const { metadata } = event.data;
        const { reservationId } = metadata || {};

        if (reservationId) {
          await Reservation.update(
            { paymentStatus: 'failed' },
            { where: { id: reservationId } }
          );
          console.log(`Payment failed for reservation ${reservationId}`);
        }
        break;
      }

      case 'refund.processed': {
        const { metadata } = event.data;
        const { reservationId } = metadata || {};

        if (reservationId) {
          await Reservation.update(
            { paymentStatus: 'refunded', status: 'cancelled' },
            { where: { id: reservationId } }
          );
          await Room.update(
            { availability: true },
            { where: { id: (await Reservation.findByPk(reservationId))?.roomId } }
          );
          console.log(`Refund processed for reservation ${reservationId}`);
        }
        break;
      }

      default:
        console.log(`Unhandled Paystack event: ${event.event}`);
    }

    // Always return 200 to acknowledge receipt
    return res.status(200).json({ received: true });
  } catch (err: any) {
    console.error('Webhook error:', err);
    // Still return 200 to prevent Paystack from retrying
    return res.status(200).json({ received: true, error: err.message });
  }
};

/**
 * Get payment status for a reservation
 * GET /payments/status/:reservationId
 */
export const getPaymentStatus = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = req.user?.id;
    const { reservationId } = req.params;

    const reservation = await Reservation.findByPk(reservationId);
    if (!reservation) return res.status(404).json({ message: 'Reservation not found' });

    // Allow owner or admin to check status
    const isOwner = reservation.userId === userId;
    const isPrivileged = req.user?.type === 'admin' || req.user?.type === 'org_admin';
    if (!isOwner && !isPrivileged) return res.status(403).json({ message: 'Forbidden' });

    return res.status(200).json({
      reservationId: reservation.id,
      paymentStatus: reservation.paymentStatus,
      totalPrice: (reservation as any).totalPrice,
      paymentReference: (reservation as any).paymentReference,
    });
  } catch (err: any) {
    return res.status(500).json({ message: 'Failed to get payment status', error: err.message });
  }
};
