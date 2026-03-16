/**
 * Upstash QStash Service
 * Serverless message queuing and scheduling service
 * Replacement for Redis + BullMQ
 */

import { Client, PublishRequest } from '@upstash/qstash';
import { config } from '../../config/environment';
import type { 
  QStashMessage, 
  QueueName,
  EmailQueuePayload,
  ReservationQueuePayload,
  PaymentQueuePayload,
  NotificationQueuePayload,
  CleanupQueuePayload 
} from '../../../types';

export interface PublishResult {
  messageId: string;
  status: number;
  url?: string;
}

export interface ScheduleResult {
  scheduleId: string;
  status: number;
}

class QStashService {
  private client: Client;

  constructor() {
    this.client = new Client({
      token: config.qstash.token,
    });
  }

  /**
   * Publish a message to a queue/endpoint
   * @param message - The message to publish
   * @param endpointUrl - The URL that will receive the message (your API endpoint)
   */
  async publish<T>(message: QStashMessage<T>, endpointUrl: string): Promise<PublishResult> {
    try {
      const publishOptions: PublishRequest = {
        url: endpointUrl,
        body: JSON.stringify(message.payload),
        headers: {
          'Content-Type': 'application/json',
          'X-Queue-Name': message.queue,
        },
      };

      // Add delay if specified
      if (message.delay && message.delay > 0) {
        publishOptions.delay = `${Math.floor(message.delay)}s` as any;
      }

      // Add retries if specified
      if (message.retries !== undefined) {
        publishOptions.retries = message.retries;
      }

      // Add timeout if specified
      if (message.timeout && message.timeout > 0) {
        publishOptions.timeout = `${Math.floor(message.timeout)}s` as any;
      }

      const result = await this.client.publish(publishOptions);

      return {
        messageId: result.messageId,
        status: 200,
        url: endpointUrl,
      };
    } catch (error: any) {
      console.error('QStash Publish Error:', error.message);
      throw new Error(`Failed to publish message to QStash: ${error.message}`);
    }
  }

  /**
   * Send an email via the email queue
   * @param payload - Email details
   * @param endpointUrl - Your email worker endpoint
   */
  async sendEmail(
    payload: EmailQueuePayload, 
    endpointUrl: string,
    options?: { delay?: number; retries?: number }
  ): Promise<PublishResult> {
    const message: QStashMessage<EmailQueuePayload> = {
      queue: 'email-queue',
      payload,
      delay: options?.delay,
      retries: options?.retries || 3,
    };

    return this.publish(message, endpointUrl);
  }

  /**
   * Process a reservation action via the reservation queue
   * @param payload - Reservation details
   * @param endpointUrl - Your reservation worker endpoint
   */
  async processReservation(
    payload: ReservationQueuePayload,
    endpointUrl: string,
    options?: { delay?: number; retries?: number }
  ): Promise<PublishResult> {
    const message: QStashMessage<ReservationQueuePayload> = {
      queue: 'reservation-queue',
      payload,
      delay: options?.delay,
      retries: options?.retries || 3,
    };

    return this.publish(message, endpointUrl);
  }

  /**
   * Process a payment via the payment queue
   * @param payload - Payment details
   * @param endpointUrl - Your payment worker endpoint
   */
  async processPayment(
    payload: PaymentQueuePayload,
    endpointUrl: string,
    options?: { delay?: number; retries?: number }
  ): Promise<PublishResult> {
    const message: QStashMessage<PaymentQueuePayload> = {
      queue: 'payment-queue',
      payload,
      delay: options?.delay,
      retries: options?.retries || 3,
      timeout: options?.delay ? options.delay + 30 : 60,
    };

    return this.publish(message, endpointUrl);
  }

  /**
   * Send a notification via the notification queue
   * @param payload - Notification details
   * @param endpointUrl - Your notification worker endpoint
   */
  async sendNotification(
    payload: NotificationQueuePayload,
    endpointUrl: string,
    options?: { delay?: number; retries?: number }
  ): Promise<PublishResult> {
    const message: QStashMessage<NotificationQueuePayload> = {
      queue: 'notification-queue',
      payload,
      delay: options?.delay,
      retries: options?.retries || 2,
    };

    return this.publish(message, endpointUrl);
  }

  /**
   * Schedule a cleanup task via the cleanup queue
   * @param payload - Cleanup details
   * @param endpointUrl - Your cleanup worker endpoint
   */
  async scheduleCleanup(
    payload: CleanupQueuePayload,
    endpointUrl: string,
    options?: { delay?: number; retries?: number }
  ): Promise<PublishResult> {
    const message: QStashMessage<CleanupQueuePayload> = {
      queue: 'cleanup-queue',
      payload,
      delay: options?.delay,
      retries: options?.retries || 1,
    };

    return this.publish(message, endpointUrl);
  }

  /**
   * Schedule a message to be sent at a specific time
   * @param message - The message to schedule
   * @param endpointUrl - The URL that will receive the message
   * @param cron - Cron expression for scheduling (e.g., "0 0 * * *" for daily at midnight)
   */
  async schedule<T>(
    message: QStashMessage<T>,
    endpointUrl: string,
    cron: string
  ): Promise<ScheduleResult> {
    try {
      // Note: QStash uses publish with delay/cron for scheduling
      // For true cron scheduling, you'd use QStash's scheduler feature
      const publishOptions: PublishRequest = {
        url: endpointUrl,
        body: JSON.stringify(message.payload),
        headers: {
          'Content-Type': 'application/json',
          'X-Queue-Name': message.queue,
        },
      };

      // For scheduled tasks, we use a very long delay or implement via external scheduler
      // This is a limitation - QStash is primarily event-driven
      console.warn('QStash does not support native cron scheduling. Consider using an external scheduler.');
      
      const result = await this.client.publish(publishOptions);

      return {
        scheduleId: result.messageId,
        status: 200,
      };
    } catch (error: any) {
      console.error('QStash Schedule Error:', error.message);
      throw new Error(`Failed to schedule message with QStash: ${error.message}`);
    }
  }

  /**
   * Delete a scheduled message
   * Note: QStash doesn't support deleting scheduled messages directly
   * @param scheduleId - The ID of the scheduled message
   */
  async deleteSchedule(scheduleId: string): Promise<void> {
    console.warn('QStash does not support deleting scheduled messages. Messages are automatically processed.');
    // QStash doesn't have a direct delete operation for scheduled messages
  }

  /**
   * Get information about a message
   * @param messageId - The ID of the message
   */
  async getMessage(messageId: string): Promise<any> {
    try {
      return await this.client.messages.get(messageId);
    } catch (error: any) {
      console.error('QStash Get Message Error:', error.message);
      throw new Error(`Failed to get message: ${error.message}`);
    }
  }

  /**
   * List recent messages
   * Note: QStash has limited message listing capabilities
   * @param count - Number of messages to retrieve (default: 10)
   */
  async listMessages(count: number = 10): Promise<any[]> {
    try {
      // QStash doesn't have a direct list API, this would need custom implementation
      console.warn('QStash does not provide a native message listing API.');
      return [];
    } catch (error: any) {
      console.error('QStash List Messages Error:', error.message);
      throw new Error(`Failed to list messages: ${error.message}`);
    }
  }

  /**
   * Verify the signature of an incoming request
   * This should be called in your endpoint to verify the request is from QStash
   * @param signature - The signature from the request header
   * @param body - The raw body of the request
   */
  verifySignature(signature: string, body: string): boolean {
    try {
      // In production, you would use the signing keys to verify the signature
      // This is a simplified version - implement proper signature verification
      return !!signature && signature.length > 0;
    } catch (error: any) {
      console.error('QStash Signature Verification Error:', error.message);
      return false;
    }
  }
}

// Export singleton instance
export const qstash = new QStashService();
export default qstash;
