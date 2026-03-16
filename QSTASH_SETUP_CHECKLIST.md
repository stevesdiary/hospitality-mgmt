# Upstash QStash Setup Checklist

Use this checklist to complete your QStash setup and verify the migration.

## Pre-Setup Requirements

- [ ] Upstash account created at https://console.upstash.io/
- [ ] QStash instance created
- [ ] QStash token copied
- [ ] Current signing key copied
- [ ] Next signing key copied
- [ ] QStash URL noted (typically https://qstash.upstash.io)

## Configuration Steps

### 1. Install Dependencies

- [ ] Run `npm install` (if not already done)
- [ ] Verify `@upstash/qstash` is in `node_modules`
- [ ] Check package.json shows: `"@upstash/qstash": "^2.x.x"`

### 2. Update Environment Variables

- [ ] Copy `.env.example` to `.env` (or update existing `.env`)
- [ ] Add QStash credentials:
  ```env
  QSTASH_URL=https://qstash.upstash.io
  QSTASH_TOKEN=<paste_your_token_here>
  QSTASH_CURRENT_SIGNING_KEY=<paste_current_key_here>
  QSTASH_NEXT_SIGNING_KEY=<paste_next_key_here>
  ```
- [ ] Verify no syntax errors in .env file
- [ ] Ensure .env is NOT committed to git (check .gitignore)

### 3. TypeScript Compilation

- [ ] Run `npm run build` to compile TypeScript
- [ ] Fix any compilation errors
- [ ] Verify no import errors for QStash types
- [ ] Check that all type definitions are resolved

### 4. Create Worker Endpoints

Choose which queues you want to implement first:

#### Email Handler
- [ ] Create route: `/api/workers/email-handler`
- [ ] Implement signature verification
- [ ] Implement email sending logic
- [ ] Return 200 OK on success
- [ ] Handle errors appropriately

#### Reservation Handler
- [ ] Create route: `/api/workers/reservation-handler`
- [ ] Implement signature verification
- [ ] Handle reservation actions (create, confirm, cancel, update)
- [ ] Return 200 OK on success

#### Payment Handler
- [ ] Create route: `/api/workers/payment-handler`
- [ ] Implement signature verification
- [ ] Process payment operations
- [ ] Handle timeouts appropriately
- [ ] Return 200 OK on success

#### Notification Handler
- [ ] Create route: `/api/workers/notification-handler`
- [ ] Implement signature verification
- [ ] Send notifications (email, SMS, push)
- [ ] Return 200 OK on success

#### Cleanup Handler
- [ ] Create route: `/api/workers/cleanup-handler`
- [ ] Implement signature verification
- [ ] Implement cleanup logic
- [ ] Support dry-run mode
- [ ] Return 200 OK on success

### 5. Local Development Setup

For local testing, you need publicly accessible URLs:

- [ ] Install ngrok: `npm install -g ngrok`
- [ ] Start your app: `npm run dev`
- [ ] In separate terminal: `ngrok http 3000`
- [ ] Copy ngrok URL (e.g., https://abc123.ngrok.io)
- [ ] Use ngrok URL in test messages

### 6. Test Basic Publishing

Create a test script:

```typescript
// test-qstash.ts
import { qstash } from './src/shared/services/qstash.service';

async function testQStash() {
  try {
    const result = await qstash.publish(
      {
        queue: 'notification-queue',
        payload: { test: true, message: 'Hello from QStash!' },
        retries: 1,
      },
      'YOUR_NGROK_URL/api/workers/notification-handler'
    );
    
    console.log('✅ Message published:', result.messageId);
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testQStash();
```

- [ ] Create test script
- [ ] Run test: `npx ts-node test-qstash.ts`
- [ ] Verify message appears in Upstash dashboard
- [ ] Check worker endpoint receives the message
- [ ] Confirm 200 OK response returned

### 7. Test Each Queue Type

Test each pre-configured queue:

#### Email Queue Test
- [ ] Call `qstash.sendEmail()` with test data
- [ ] Verify email handler receives message
- [ ] Check email would be sent (mock or real)

#### Reservation Queue Test
- [ ] Call `qstash.processReservation()` with test action
- [ ] Verify reservation handler processes correctly
- [ ] Check database updates if applicable

#### Payment Queue Test
- [ ] Call `qstash.processPayment()` with test payment
- [ ] Verify payment handler processes correctly
- [ ] Check timeout handling works

#### Notification Queue Test
- [ ] Call `qstash.sendNotification()` with test notification
- [ ] Verify notification handler receives it
- [ ] Check notification delivery

#### Cleanup Queue Test
- [ ] Call `qstash.scheduleCleanup()` with test parameters
- [ ] Set dryRun: true for safety
- [ ] Verify cleanup handler receives it

### 8. Signature Verification Testing

- [ ] Test with valid signature → should succeed
- [ ] Test with invalid signature → should return 401
- [ ] Test with missing signature → should return 401
- [ ] Verify security is working correctly

### 9. Retry Logic Testing

- [ ] Create handler that fails intentionally
- [ ] Publish message with retries: 3
- [ ] Verify QStash retries on failure
- [ ] Check all retry attempts in logs
- [ ] Confirm eventual success or failure after max retries

### 10. Delayed Message Testing

- [ ] Publish message with delay: 10 (10 seconds)
- [ ] Note exact time of publish
- [ ] Verify handler receives message after delay
- [ ] Calculate actual delay vs expected delay

## Post-Configuration Verification

### Code Review

- [ ] Search codebase for any Redis references
- [ ] Verify all imports use qstash service
- [ ] Check environment variables match schema
- [ ] Review error handling in handlers

### Security Checks

- [ ] .env file is in .gitignore
- [ ] No API keys committed to version control
- [ ] Signature verification implemented in all handlers
- [ ] HTTPS enforced in production

### Performance Testing

- [ ] Measure message publish latency
- [ ] Measure handler response times
- [ ] Test with concurrent messages
- [ ] Check for any timeout issues

### Monitoring Setup

- [ ] Access Upstash dashboard
- [ ] Review message metrics
- [ ] Set up alerts for failures
- [ ] Configure cost monitoring

## Production Deployment

Before going live:

- [ ] Use production QStash instance (separate from dev)
- [ ] Update production environment variables
- [ ] Deploy worker endpoints to production
- [ ] Test with production URLs
- [ ] Configure CORS settings
- [ ] Set up production monitoring
- [ ] Document QStash credentials securely
- [ ] Create runbook for common issues
- [ ] Train team on new system

## Cost Monitoring

- [ ] Check current usage in Upstash dashboard
- [ ] Estimate monthly costs based on volume
- [ ] Set up billing alerts
- [ ] Compare actual costs vs Redis savings
- [ ] Optimize if costs exceed expectations

## Documentation Updates

- [ ] Update API documentation with async patterns
- [ ] Document queue types and payloads
- [ ] Create troubleshooting guide for team
- [ ] Update onboarding docs
- [ ] Add QStash section to architecture docs

## Rollback Plan (If Needed)

Keep these ready just in case:

- [ ] Redis connection string documented
- [ ] BullMQ configuration saved
- [ ] Feature flag to switch between QStash/Redis
- [ ] Rollback procedure documented
- [ ] Team knows how to revert if needed

## Success Criteria

Migration is successful when:

- ✅ All test messages delivered successfully
- ✅ All handlers process messages correctly
- ✅ Signature verification working
- ✅ Retry logic functioning properly
- ✅ Delayed messages work as expected
- ✅ Error rates < 1%
- ✅ Team comfortable with new system
- ✅ Documentation complete
- ✅ Production deployment successful

## Troubleshooting Common Issues

### Issue: Cannot connect to QStash

**Check:**
- [ ] QSTASH_TOKEN is correct
- [ ] No extra spaces in .env file
- [ ] Network connectivity
- [ ] Firewall allows outbound HTTPS

### Issue: Messages not delivered to handler

**Check:**
- [ ] Endpoint URL is publicly accessible
- [ ] Not using localhost (use ngrok for dev)
- [ ] Handler returns 200 OK
- [ ] Check Upstash dashboard for errors

### Issue: Signature verification always fails

**Check:**
- [ ] Using correct signing keys
- [ ] Body passed to verify is raw JSON string
- [ ] Headers passed correctly from Express
- [ ] No middleware modifying body before verification

### Issue: High error rate

**Solutions:**
- [ ] Increase retry count
- [ ] Add longer delays between retries
- [ ] Improve error handling in handlers
- [ ] Check handler logs for specific errors
- [ ] Implement idempotency

### Issue: Costs higher than expected

**Optimization:**
- [ ] Reduce unnecessary retries
- [ ] Batch small tasks together
- [ ] Use appropriate delays
- [ ] Monitor usage patterns
- [ ] Eliminate duplicate messages

## Resources

- **Upstash Console**: https://console.upstash.io/
- **QStash Docs**: https://upstash.com/docs/qstash
- **SDK GitHub**: https://github.com/upstash/qstash-js
- **Support**: support@upstash.com

---

**Checklist Created**: March 9, 2026  
**Last Updated**: March 9, 2026  
**Status**: Ready for Implementation  
**Estimated Setup Time**: 2-4 hours
