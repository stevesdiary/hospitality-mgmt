import apiService from './api';

interface InitializePaymentResponse {
  message: string;
  authorizationUrl: string;
  accessCode: string;
  reference: string;
  amount: number;
}

interface VerifyPaymentResponse {
  message: string;
  status: 'success' | 'failed' | 'abandoned';
  reservationId: string;
  amount: number;
  paidAt: string;
}

interface PaymentStatusResponse {
  reservationId: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  totalPrice: number;
  paymentReference: string | null;
}

class PaymentService {
  private baseUrl = '/payments';

  /**
   * Initialize payment for a reservation
   * Returns Paystack authorization URL to redirect user
   */
  async initializePayment(reservationId: string): Promise<InitializePaymentResponse> {
    const response = await apiService.post<InitializePaymentResponse>(
      `${this.baseUrl}/initialize`,
      { reservationId }
    );
    return response as unknown as InitializePaymentResponse;
  }

  /**
   * Verify payment after Paystack callback
   */
  async verifyPayment(reference: string): Promise<VerifyPaymentResponse> {
    const response = await apiService.get<VerifyPaymentResponse>(
      `${this.baseUrl}/verify/${reference}`
    );
    return response as unknown as VerifyPaymentResponse;
  }

  /**
   * Get payment status for a reservation
   */
  async getPaymentStatus(reservationId: string): Promise<PaymentStatusResponse> {
    const response = await apiService.get<PaymentStatusResponse>(
      `${this.baseUrl}/status/${reservationId}`
    );
    return response as unknown as PaymentStatusResponse;
  }

  /**
   * Redirect to Paystack checkout
   */
  redirectToPaystack(authorizationUrl: string): void {
    window.location.href = authorizationUrl;
  }
}

export const paymentService = new PaymentService();
export default paymentService;
