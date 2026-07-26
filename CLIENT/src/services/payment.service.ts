import apiService from './api';

/**
 * Payments (Paystack). The charge amount is decided by the backend from the
 * reservation — the client never sends an amount.
 */
class PaymentService {
  /** Start a payment and get Paystack's hosted checkout URL. */
  async initialize(data: { bookingReference?: string; reservationId?: string; callbackUrl?: string }) {
    return apiService.post<{
      authorizationUrl: string;
      reference: string;
      amount: number;
      currency: string;
    }>('/payments/initialize', data);
  }

  /** Confirm a transaction after the guest returns from Paystack. */
  async verify(reference: string) {
    return apiService.get<{ status: string; reference: string; message: string }>(
      `/payments/verify/${reference}`
    );
  }

  /** Staff: payments for the caller's tenant. */
  async list() {
    return apiService.get<{ Count: number; Payments: any[] }>('/payments');
  }
}

export const paymentService = new PaymentService();
export default paymentService;
