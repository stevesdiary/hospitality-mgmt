/**
 * Paystack Payment Service
 * Handles payment initialization, verification, and webhooks
 */

import crypto from 'crypto';

interface PaystackInitResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    status: 'success' | 'failed' | 'abandoned';
    reference: string;
    amount: number;
    currency: string;
    channel: string;
    paid_at: string;
    customer: {
      email: string;
      first_name: string;
      last_name: string;
    };
    metadata: Record<string, any>;
  };
}

class PaystackService {
  private secretKey: string;
  private baseUrl = 'https://api.paystack.co';

  constructor() {
    this.secretKey = process.env.PAYSTACK_SECRET_KEY || '';
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data: any = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || `Paystack error: ${response.status}`);
    }

    return data as T;
  }

  /**
   * Initialize a payment transaction
   * @param email Customer email
   * @param amount Amount in kobo (NGN * 100)
   * @param reference Unique transaction reference
   * @param metadata Additional data (reservationId, userId, etc.)
   * @param callbackUrl URL to redirect after payment
   */
  async initializeTransaction(
    email: string,
    amount: number,
    reference: string,
    metadata: Record<string, any> = {},
    callbackUrl?: string
  ): Promise<PaystackInitResponse> {
    const payload: Record<string, any> = {
      email,
      amount, // Already in kobo
      reference,
      metadata,
      currency: 'NGN',
    };

    if (callbackUrl) {
      payload.callback_url = callbackUrl;
    }

    return this.request<PaystackInitResponse>('/transaction/initialize', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  /**
   * Verify a transaction by reference
   * @param reference Transaction reference
   */
  async verifyTransaction(reference: string): Promise<PaystackVerifyResponse> {
    return this.request<PaystackVerifyResponse>(`/transaction/verify/${encodeURIComponent(reference)}`);
  }

  /**
   * Verify webhook signature
   * @param payload Raw request body
   * @param signature x-paystack-signature header
   */
  verifyWebhookSignature(payload: string, signature: string): boolean {
    const hash = crypto
      .createHmac('sha512', this.secretKey)
      .update(payload)
      .digest('hex');
    return hash === signature;
  }

  /**
   * Generate a unique transaction reference
   * @param prefix Optional prefix (e.g., 'RES' for reservation)
   */
  generateReference(prefix = 'TXN'): string {
    const timestamp = Date.now().toString(36);
    const random = crypto.randomBytes(4).toString('hex');
    return `${prefix}_${timestamp}_${random}`.toUpperCase();
  }

  /**
   * Convert NGN to kobo
   */
  toKobo(naira: number): number {
    return Math.round(naira * 100);
  }

  /**
   * Convert kobo to NGN
   */
  toNaira(kobo: number): number {
    return kobo / 100;
  }
}

export const paystackService = new PaystackService();
export default paystackService;
