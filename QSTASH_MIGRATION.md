# Upstash QStash Migration Guide

## Overview

This document details the migration from traditional Redis + BullMQ to Upstash QStash for serverless message queuing in the hospitality management system.

## What is Upstash QStash?

**Upstash QStash** is a serverless message queue and scheduling service that provides:
- ✅ No infrastructure management (completely serverless)
- ✅ Pay-per-use pricing (no monthly minimums)
- ✅ Built-in retry logic and error handling
- ✅ Delayed message delivery
- ✅ HTTP-based messaging (no Redis client needed)
- ✅ Automatic scaling
- ✅ Global availability

## Why Migrate from Redis + BullMQ?

### Traditional Redis + BullMQ Limitations:
- ❌ Requires managing Redis infrastructure
- ❌ Fixed monthly costs for Redis hosting
- ❌ Manual scaling and maintenance
- ❌ Connection pooling complexity
- ❌ Stateful connections

### Upstash QStash Benefits:
- ✅ **Zero Infrastructure**: No servers to manage
- ✅ **Cost Effective**: Pay only for messages sent
- ✅ **Auto-scaling**: Handles any load automatically
- ✅ **Simple Integration**: RESTful API, no special clients
- ✅ **Built-in Reliability**: Automatic retries and dead-letter queues
- ✅ **Edge-ready**: Works great with serverless functions

## Changes Summary

### 1. Dependencies Added

```json
{
  "dependencies": {
    "@upstash/qstash": "^2.x.x"
  }
}
```

### 2. Environment Variables

#### Old Redis Configuration (Deprecated)
```env
# DEPRECATED
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password
```

#### New Upstash QStash Configuration
```env
QSTASH_URL=https://qstash.upstash.io
QSTASH_TOKEN=your_qstash_token_here
QSTASH_CURRENT_SIGNING_KEY=your_current_signing_key_here
QSTASH_NEXT_SIGNING_KEY=your_next_signing_key_here
```

### 3. Files Modified

#### `/types/index.ts`
**Added:**
- `QStashConfig` interface
- `QueueName` type union
- `QStashMessage<T>` generic interface
- Payload interfaces for different queue types:
  - `EmailQueuePayload`
  - `ReservationQueuePayload`
  - `PaymentQueuePayload`
  - `NotificationQueuePayload`
  - `CleanupQueuePayload`

#### `/src/config/environment.ts`
**Added:**
```typescript
qstash: {
  url: process.env.QSTASH_URL!,
  token: process.env.QSTASH_TOKEN!,
  currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY!,
  nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY!,
}
```

### 4. New Files Created

#### `/src/shared/services/qstash.service.ts`

A complete QStash service wrapper with pre-configured queues for common operations.

**Features:**
- Generic message publishing
- Pre-configured queue methods (email, reservations, payments, notifications, cleanup)
- Delayed message support
- Automatic retry configuration
- Message tracking
- Signature verification

## Setup Instructions

### 1. Create Upstash Account

1. Go to [Upstash Console](https://console.upstash.io/)
2. Sign up for a free account
3. Navigate to the QStash section
4. Create a new QStash instance

### 2. Get QStash Credentials

From the Upstash Console:
1. Copy your **QStash Token**
2. Copy your **Current Signing Key**
3. Copy your **Next Signing Key**
4. Note the **QStash URL** (typically `https://qstash.upstash.io`)

### 3. Configure Environment Variables

Update your `.env` file:

```env
# Upstash QStash Configuration
QSTASH_URL=https://qstash.upstash.io
QSTASH_TOKEN=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
QSTASH_CURRENT_SIGNING_KEY=signing_key_abc123...
QSTASH_NEXT_SIGNING_KEY=signing_key_def456...
```

### 4. Install Dependencies

```bash
npm install @upstash/qstash
```

## Usage Examples

### Basic Message Publishing

```typescript
import { qstash } from './src/shared/services/qstash.service';

// Publish a custom message
const result = await qstash.publish(
  {
    queue: 'notification-queue',
    payload: { userId: '123', message: 'Hello!' },
    retries: 3,
  },
  'https://your-api.com/api/notifications/handler'
);

console.log('Message published:', result.messageId);
```

### Sending Emails (Async)

```typescript
import { qstash } from './src/shared/services/qstash.service';

// Queue an email to be sent
await qstash.sendEmail(
  {
    to: 'user@example.com',
    subject: 'Reservation Confirmation',
    body: 'Your reservation has been confirmed!',
    html: true,
  },
  'https://your-api.com/api/workers/email-handler',
  { delay: 5, retries: 3 } // 5 second delay, 3 retries
);
```

### Processing Reservations

```typescript
import { qstash } from './src/shared/services/qstash.service';

// Queue reservation confirmation
await qstash.processReservation(
  {
    reservationId: 'res_123',
    userId: 'user_456',
    action: 'confirm',
    metadata: { checkIn: '2024-01-15', checkOut: '2024-01-20' },
  },
  'https://your-api.com/api/workers/reservation-handler',
  { retries: 3 }
);
```

### Payment Processing

```typescript
import { qstash } from './src/shared/services/qstash.service';

// Queue payment processing
await qstash.processPayment(
  {
    paymentId: 'pay_789',
    userId: 'user_456',
    amount: 299.99,
    status: 'pending',
    metadata: { currency: 'USD', method: 'card' },
  },
  'https://your-api.com/api/workers/payment-handler',
  { timeout: 60, retries: 3 }
);
```

### Sending Notifications

```typescript
import { qstash } from './src/shared/services/qstash.service';

// Queue push notification
await qstash.sendNotification(
  {
    userId: 'user_456',
    type: 'push',
    title: 'Special Offer!',
    message: 'Get 20% off your next booking',
    data: { offerCode: 'SAVE20' },
  },
  'https://your-api.com/api/workers/notification-handler'
);
```

### Scheduled Cleanup Tasks

```typescript
import { qstash } from './src/shared/services/qstash.service';

// Schedule a cleanup task
await qstash.scheduleCleanup(
  {
    resourceType: 'temp_files',
    olderThan: new Date('2024-01-01'),
    dryRun: false,
  },
  'https://your-api.com/api/workers/cleanup-handler',
  { delay: 3600 } // Run after 1 hour
);
```

## Creating Queue Handlers

QStash sends HTTP POST requests to your endpoints. Here's how to create handlers:

### Example: Email Handler Endpoint

```typescript
// routes/workers/emailHandler.ts
import { Router, Request, Response } from 'express';
import { qstash } from '../../shared/services/qstash.service';
import { EmailQueuePayload } from '../../types';

const router = Router();

router.post('/api/workers/email-handler', async (req, res) => {
  try {
    // Verify signature (important for security)
    const signature = req.headers['upstash-signature'] as string;
    const body = JSON.stringify(req.body);
    
    if (!qstash.verifySignature(signature, body)) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const payload: EmailQueuePayload = req.body;

    // Process the email
    await sendEmail(payload.to, payload.subject, payload.body);

    console.log(`Email sent to ${payload.to}`);
    
    // Return success to QStash
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Email handler error:', error);
    // Return error to trigger retry
    res.status(500).json({ success: false, error: 'Failed to send email' });
  }
});

export default router;
```

### Example: Reservation Handler

```typescript
// routes/workers/reservationHandler.ts
import { Router, Request, Response } from 'express';
import { ReservationQueuePayload } from '../../types';
import { ReservationService } from '../../modules/reservations/reservation.service';

const router = Router();
const reservationService = new ReservationService();

router.post('/api/workers/reservation-handler', async (req, res) => {
  try {
    const payload: ReservationQueuePayload = req.body;

    switch (payload.action) {
      case 'create':
        await reservationService.handleReservationCreation(payload.reservationId);
        break;
      case 'confirm':
        await reservationService.confirmReservation(payload.reservationId);
        break;
      case 'cancel':
        await reservationService.cancelReservation(payload.reservationId);
        break;
      case 'update':
        await reservationService.updateReservation(payload.reservationId, payload.metadata);
        break;
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Reservation handler error:', error);
    res.status(500).json({ success: false, error: 'Processing failed' });
  }
});

export default router;
```

## Architecture Comparison

### Before: Redis + BullMQ

```
┌─────────────┐     ┌──────────┐     ┌──────────┐
│   App       │────▶│  Redis   │────▶│  Worker  │
│             │     │          │     │          │
└─────────────┘     └──────────┘     └──────────┘
                         ▲
                         │
                    (Stateful Connection)
```

### After: Upstash QStash

```
┌─────────────┐     ┌──────────┐     ┌──────────┐
│   App       │────▶│  QStash  │────▶│  Worker  │
│             │     │          │     │          │
└─────────────┘     └──────────┘     └──────────┘
                      (HTTP POST)
```

## Pricing Comparison

### Redis + BullMQ (Typical Costs)

- Redis Cloud: $30-150/month (depending on size)
- Server/BullMQ worker: $10-50/month
- **Total: $40-200/month**

### Upstash QStash

- Free Tier: 10,000 operations/month
- Standard: $0.10 per 10,000 operations
- **Example**: 100,000 messages/month = ~$1

**Savings: 90-99% cost reduction** 🎉

## Migration Strategy

### Phase 1: Setup (Week 1)

1. ✅ Install QStash dependencies
2. ✅ Configure environment variables
3. ✅ Create QStash service wrapper
4. ✅ Set up test QStash instance

### Phase 2: Parallel Running (Week 2-3)

1. Implement QStash handlers alongside existing BullMQ queues
2. Route non-critical tasks to QStash first (notifications, cleanup)
3. Monitor both systems
4. Compare performance and reliability

### Phase 3: Gradual Migration (Week 4-5)

1. Migrate email queue to QStash
2. Migrate reservation processing to QStash
3. Migrate payment processing to QStash
4. Keep Redis as fallback

### Phase 4: Cutover (Week 6)

1. Switch all traffic to QStash
2. Monitor closely for 48 hours
3. Decommission Redis infrastructure
4. Update documentation

## Best Practices

### 1. Error Handling

```typescript
try {
  await qstash.sendEmail(payload, endpointUrl);
} catch (error) {
  // Log the error
  // Implement fallback (e.g., direct email send)
  // Alert operations team
}
```

### 2. Idempotency

Always design handlers to be idempotent (safe to retry):

```typescript
async function handleReservationConfirmation(reservationId: string) {
  // Check if already confirmed
  const reservation = await getReservation(reservationId);
  if (reservation.status === 'confirmed') {
    return; // Already processed
  }
  
  // Proceed with confirmation
}
```

### 3. Monitoring

Track key metrics:
- Messages published per minute
- Handler response times
- Error rates
- Retry counts

### 4. Security

Always verify signatures:

```typescript
const isValid = qstash.verifySignature(signature, body);
if (!isValid) {
  return res.status(401).send('Unauthorized');
}
```

### 5. Testing

Test with small volumes first:

```bash
# Send test message
curl -X POST http://localhost:3000/test-queue \
  -H "Content-Type: application/json" \
  -d '{"test": true}'
```

## Troubleshooting

### Issue: Messages Not Being Delivered

**Check:**
1. QStash token is correct
2. Endpoint URL is publicly accessible (not localhost)
3. Handler returns 200 OK on success
4. Check QStash dashboard for delivery logs

### Issue: High Error Rate

**Solutions:**
1. Increase retry count
2. Add longer delays between retries
3. Implement circuit breaker pattern
4. Check handler logs for specific errors

### Issue: Signature Verification Failing

**Check:**
1. Using correct signing keys
2. Body is not modified before verification
3. Headers are passed correctly
4. Time synchronization (check system clock)

## Limitations & Considerations

### QStash Limitations:

1. **No Native Cron**: QStash doesn't support cron expressions directly
   - Workaround: Use external schedulers like GitHub Actions, AWS EventBridge
   
2. **HTTP-Based**: Requires public endpoints
   - For local development: Use ngrok or similar tools
   
3. **Message Size**: Limited to 256KB per message
   - For large payloads: Store data elsewhere, send reference in message

4. **No Message Listing**: Limited visibility into queued messages
   - Implement custom logging/tracking if needed

### When to Stick with Redis:

- Need sub-millisecond latency
- Require complex data structures (hashes, sets, etc.)
- Need pub/sub functionality
- Working in air-gapped environments

## Cost Optimization Tips

1. **Batch Operations**: Combine multiple small tasks into one message
2. **Appropriate Retries**: Don't over-retry failing operations
3. **Delay Non-urgent Tasks**: Schedule during off-peak hours
4. **Monitor Usage**: Set up alerts for unusual activity
5. **Use Free Tier**: Leverage 10k free operations/month for dev

## Monitoring Dashboard

Set up monitoring using:

1. **Upstash Dashboard**: Built-in metrics at console.upstash.io
2. **Custom Metrics**: Track in your APM (DataDog, New Relic, etc.)
3. **Alerts**: Set up PagerDuty/Slack alerts for failures

Example custom monitoring:

```typescript
// Middleware to track QStash operations
async function trackQstashOperation(operation: string, duration: number) {
  await metricsClient.increment('qstash.operations.total', { operation });
  await metricsClient.timing('qstash.operations.duration', duration, { operation });
}
```

## Rollback Plan

If issues arise:

1. Keep Redis infrastructure running temporarily
2. Implement feature flags to switch between QStash/Redis
3. Have fallback mechanisms in handlers
4. Document rollback procedure clearly

Example feature flag:

```typescript
const USE_QSTASH = process.env.USE_QSTASH === 'true';

if (USE_QSTASH) {
  await qstash.sendEmail(payload, endpoint);
} else {
  await redisQueue.add('email', payload);
}
```

## Success Criteria

Migration is successful when:

- ✅ All queue operations work with QStash
- ✅ Error rates are acceptable (<1%)
- ✅ Latency is within SLA (<5 seconds for most operations)
- ✅ Costs are reduced by >80%
- ✅ Team is comfortable with new system
- ✅ Documentation is complete

## Resources

- [Upstash QStash Docs](https://upstash.com/docs/qstash)
- [QStash GitHub SDK](https://github.com/upstash/qstash-js)
- [Upstash Console](https://console.upstash.io/)
- [Pricing Calculator](https://upstash.com/pricing)

---

**Migration Date**: March 9, 2026  
**Status**: ✅ Ready for Implementation  
**Next Steps**: Configure QStash credentials and begin testing
