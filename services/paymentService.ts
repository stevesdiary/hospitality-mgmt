/**
 * Payments (Paystack)
 *
 * Security rules this module exists to enforce:
 *  1. The charge amount is ALWAYS computed server-side from the reservation's
 *     room price and stay length. A client-supplied amount is never trusted.
 *  2. Money is handled in the currency's smallest unit (kobo) as integers, so
 *     there is no floating-point rounding.
 *  3. Webhooks are only acted on after verifying Paystack's HMAC signature.
 *
 * Node 22 provides global fetch, so this needs no HTTP dependency.
 */

import crypto from 'crypto';
import { Room } from '../models';

const PAYSTACK_BASE = 'https://api.paystack.co';

/** VAT applied to the room subtotal; matches the rate shown at checkout. */
export const VAT_RATE = 0.075;

const secretKey = (): string => {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) throw new Error('PAYSTACK_SECRET_KEY is not configured');
  return key;
};

/** Whole nights between two dates, minimum 1. */
export const nightsBetween = (dateIn: Date | string, dateOut: Date | string): number => {
  const ms = new Date(dateOut).getTime() - new Date(dateIn).getTime();
  return Math.max(1, Math.round(ms / 86_400_000));
};

/**
 * The authoritative amount for a reservation, in kobo.
 * Derived from the room's stored price — never from the request body.
 */
export const computeAmountKobo = async (reservation: any): Promise<number> => {
  const room = await Room.findByPk(reservation.roomId);
  if (!room) throw new Error('Room not found for reservation');

  const pricePerNight = Number((room as any).price) || 0;
  if (pricePerNight <= 0) throw new Error('Room has no price set');

  const nights = nightsBetween(reservation.dateIn, reservation.dateOut);
  const subtotal = pricePerNight * nights;
  const total = subtotal + Math.round(subtotal * VAT_RATE);

  // Naira -> kobo. Rounded to an integer so no fractional kobo can appear.
  return Math.round(total * 100);
};

interface InitializeResult {
  authorizationUrl: string;
  reference: string;
  accessCode?: string;
}

/**
 * Create a Paystack transaction and get the hosted checkout URL.
 * `reference` is ours, so we can correlate the callback/webhook to our Payment row.
 */
export const initializeTransaction = async (params: {
  email: string;
  amountKobo: number;
  reference: string;
  callbackUrl?: string;
  metadata?: Record<string, any>;
}): Promise<InitializeResult> => {
  const response = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secretKey()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: params.email,
      amount: params.amountKobo,
      reference: params.reference,
      callback_url: params.callbackUrl,
      metadata: params.metadata,
    }),
  });

  const payload: any = await response.json().catch(() => ({}));
  if (!response.ok || !payload?.status) {
    throw new Error(payload?.message || 'Could not start the payment');
  }

  return {
    authorizationUrl: payload.data.authorization_url,
    reference: payload.data.reference,
    accessCode: payload.data.access_code,
  };
};

export interface VerifiedTransaction {
  status: 'success' | 'failed' | 'abandoned' | 'pending';
  amountKobo: number;
  currency: string;
  channel?: string;
  paidAt?: Date;
  reference: string;
}

/** Ask Paystack for the true state of a transaction. */
export const verifyTransaction = async (reference: string): Promise<VerifiedTransaction> => {
  const response = await fetch(`${PAYSTACK_BASE}/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${secretKey()}` },
  });

  const payload: any = await response.json().catch(() => ({}));
  if (!response.ok || !payload?.status) {
    throw new Error(payload?.message || 'Could not verify the payment');
  }

  const data = payload.data ?? {};
  const rawStatus = String(data.status || '').toLowerCase();
  const status: VerifiedTransaction['status'] =
    rawStatus === 'success' ? 'success'
      : rawStatus === 'abandoned' ? 'abandoned'
        : rawStatus === 'failed' ? 'failed'
          : 'pending';

  return {
    status,
    amountKobo: Number(data.amount) || 0,
    currency: data.currency || 'NGN',
    channel: data.channel,
    paidAt: data.paid_at ? new Date(data.paid_at) : undefined,
    reference: data.reference || reference,
  };
};

/**
 * Verify a Paystack webhook signature (HMAC SHA512 of the RAW body with the
 * secret key). Uses a timing-safe comparison. Without this check anyone could
 * POST a fake "payment succeeded" event.
 */
export const isValidWebhookSignature = (rawBody: Buffer | string | undefined, signature?: string): boolean => {
  if (!rawBody || !signature) return false;
  try {
    const expected = crypto.createHmac('sha512', secretKey()).update(rawBody).digest('hex');
    const a = Buffer.from(expected, 'utf8');
    const b = Buffer.from(signature, 'utf8');
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
};

/** Our own transaction reference, correlated to the booking. */
export const buildPaymentReference = (bookingReference?: string): string => {
  const suffix = crypto.randomBytes(4).toString('hex').toUpperCase();
  const base = (bookingReference || 'PAY').replace(/[^A-Za-z0-9-]/g, '');
  return `${base}-${suffix}`;
};
