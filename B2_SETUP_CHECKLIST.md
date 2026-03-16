# Backblaze B2 Setup Checklist

Use this checklist to complete the Backblaze B2 setup and verify the migration.

## Pre-Setup Requirements

- [ ] Backblaze B2 account created
- [ ] Bucket created in Backblaze B2 console
- [ ] Application keys generated
- [ ] Bucket ID noted
- [ ] Bucket name noted

## Configuration Steps

### 1. Update Environment Variables

- [ ] Copy `.env.example` to `.env` (if not already done)
- [ ] Add B2 credentials to `.env`:
  ```env
  B2_KEY_ID=your_actual_key_id_here
  B2_APPLICATION_KEY=your_actual_application_key_here
  B2_BUCKET_ID=your_actual_bucket_id_here
  B2_BUCKET_NAME=your_actual_bucket_name_here
  ```

### 2. Verify Dependencies

- [ ] Run `npm install` to ensure all dependencies are installed
- [ ] Verify `backblaze-b2` is in `node_modules`
- [ ] Verify `@types/backblaze-b2` is in `node_modules/@types`

### 3. TypeScript Compilation

- [ ] Run `npm run build` to compile TypeScript
- [ ] Fix any compilation errors if they occur
- [ ] Verify no Cloudinary imports remain

### 4. Test Upload Functionality

- [ ] Start the development server: `npm run dev`
- [ ] Verify database connection succeeds
- [ ] Prepare a test image file
- [ ] Test upload endpoint:
  ```bash
  curl -X POST http://localhost:3000/upload \
    -F "image=@/path/to/test-image.jpg"
  ```
- [ ] Verify response contains download URL
- [ ] Check that URL format is: `https://f{bucketId}.backblazeb2.com/file/{bucketName}/...`

### 5. Verify File Access

- [ ] Open the returned download URL in browser
- [ ] Verify image displays correctly
- [ ] Check file appears in Backblaze B2 bucket console

### 6. Test Additional Features (Optional)

- [ ] Test file listing via B2 service
- [ ] Test file deletion via B2 service
- [ ] Test file metadata retrieval

## Post-Migration Verification

### Code Review

- [ ] Search codebase for any remaining `cloudinary` references
- [ ] Verify all imports use `b2Storage` service
- [ ] Check that environment variables match new schema

### Security Checks

- [ ] Ensure `.env` file is in `.gitignore`
- [ ] Verify no API keys are committed to version control
- [ ] Review CORS settings for B2 bucket

### Performance Testing

- [ ] Measure upload speed compared to Cloudinary
- [ ] Check download speed from B2
- [ ] Monitor any timeout issues with large files

## Production Deployment

Before deploying to production:

- [ ] Set up production B2 bucket (separate from dev/test)
- [ ] Generate production application keys
- [ ] Update production environment variables
- [ ] Configure appropriate CORS settings
- [ ] Set up monitoring/alerting for storage costs
- [ ] Document B2 credentials in secure password manager
- [ ] Test rollback procedure (keep Cloudinary as backup temporarily)

## Cost Monitoring

- [ ] Set up Backblaze B2 cost alerts
- [ ] Monitor daily download usage (first 1GB/day is free)
- [ ] Track monthly storage costs
- [ ] Compare actual costs vs Cloudinary savings

## Documentation Updates

- [ ] Update API documentation with new upload response format
- [ ] Document B2 file URL structure for frontend developers
- [ ] Create runbook for B2-related issues
- [ ] Update onboarding docs for new team members

## Troubleshooting Common Issues

### Upload Fails
- [ ] Check B2 credentials are correct
- [ ] Verify bucket exists and is accessible
- [ ] Check network connectivity
- [ ] Review server logs for specific error messages

### File Not Accessible After Upload
- [ ] Check if bucket is private or public
- [ ] For private buckets, implement signed URLs
- [ ] Verify CORS configuration allows access
- [ ] Check firewall/network rules

### High Download Costs
- [ ] Monitor daily download volume
- [ ] Consider implementing CDN caching
- [ ] Optimize file sizes before upload
- [ ] Review access patterns and cache frequently accessed files

## Success Criteria

Migration is successful when:

- ✅ All file uploads work with B2
- ✅ Uploaded files are accessible via download URLs
- ✅ No Cloudinary dependencies remain in codebase
- ✅ TypeScript compiles without errors
- ✅ Tests pass (if you have automated tests)
- ✅ Team members can use new B2 service
- ✅ Cost tracking shows savings vs Cloudinary

## Rollback Plan (If Needed)

If issues arise:

1. Keep Cloudinary account active temporarily
2. Revert environment variables to Cloudinary config
3. Restore Cloudinary code from git history
4. Test Cloudinary functionality
5. Address B2 issues in non-production environment

---

**Checklist Created:** March 9, 2026  
**Last Updated:** March 9, 2026  
**Status:** Ready for execution
