# Backblaze B2 Migration Guide

## Overview

This document details the migration from Cloudinary to Backblaze B2 for file storage in the hospitality management system.

## Changes Summary

### 1. Dependencies Updated

**Removed:**
- `cloudinary` (^1.41.0)

**Added:**
- `backblaze-b2` (latest)
- `@types/backblaze-b2` (dev dependency)

### 2. Environment Variables

#### Old Cloudinary Configuration
```env
CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

#### New Backblaze B2 Configuration
```env
B2_KEY_ID=your_backblaze_b2_key_id
B2_APPLICATION_KEY=your_backblaze_b2_application_key
B2_BUCKET_ID=your_backblaze_b2_bucket_id
B2_BUCKET_NAME=your_backblaze_b2_bucket_name
```

### 3. Files Modified

#### `/types/index.ts`
- **Removed:** `CloudinaryConfig` interface
- **Added:** `B2Config` interface with properties:
  - `keyId: string`
  - `applicationKey: string`
  - `bucketId: string`
  - `bucketName: string`
- **Updated:** `EnvConfig` interface to use B2 environment variables instead of Cloudinary

#### `/src/config/environment.ts`
- **Replaced:** Cloudinary configuration object with Backblaze B2 configuration
- **Old:**
  ```typescript
  cloudinary: {
    cloudName: process.env.CLOUD_NAME!,
    apiKey: process.env.CLOUDINARY_API_KEY!,
    apiSecret: process.env.CLOUDINARY_API_SECRET!,
  }
  ```
- **New:**
  ```typescript
  b2: {
    keyId: process.env.B2_KEY_ID!,
    applicationKey: process.env.B2_APPLICATION_KEY!,
    bucketId: process.env.B2_BUCKET_ID!,
    bucketName: process.env.B2_BUCKET_NAME!,
  }
  ```

#### `/app.ts`
- **Removed:** Cloudinary import and configuration
- **Added:** Import of B2 storage service
- **Updated:** Image upload endpoint to use B2 instead of Cloudinary
- **Changes:**
  ```typescript
  // OLD
  import * as cloudinary from 'cloudinary';
  const result = await cloudinary.v2.uploader.upload(imagePath, options);
  return res.status(200).send({ message: 'Upload Successful', result: result.secure_url });
  
  // NEW
  import { b2Storage, UploadResult } from './src/shared/services/b2Storage.service';
  const result: UploadResult = await b2Storage.uploadFileFromPath(imagePath, `hotels/${Date.now()}`);
  return res.status(200).send({ message: 'Upload Successful', result: result.downloadUrl });
  ```

### 4. New Files Created

#### `/src/shared/services/b2Storage.service.ts`

A complete Backblaze B2 storage service with the following capabilities:

**Features:**
- File upload from Buffer
- File upload from local path
- File download (requires HTTP fetch implementation)
- File deletion
- File listing with optional prefix filtering
- File info retrieval
- Public URL generation

**Key Methods:**
- `uploadFile(fileBuffer: Buffer, fileName: string): Promise<UploadResult>`
- `uploadFileFromPath(filePath: string, fileName: string): Promise<UploadResult>`
- `downloadFile(fileId: string): Promise<Buffer>`
- `deleteFile(fileId: string, fileName: string): Promise<DeleteResult>`
- `listFiles(prefix?: string, maxFiles: number = 100): Promise<any[]>`
- `getFileInfo(fileId: string): Promise<any>`
- `getPublicUrl(fileName: string): string`

**Response Types:**
```typescript
interface UploadResult {
  fileId: string;
  fileName: string;
  bucketId: string;
  size: number;
  downloadUrl: string;
  contentType?: string;
}

interface DeleteResult {
  fileId: string;
  fileName: string;
  deleted: boolean;
}
```

## Setup Instructions

### 1. Create Backblaze B2 Account

1. Go to [Backblaze B2](https://www.backblaze.com/b2/cloud-storage.html)
2. Sign up for an account
3. Create a new bucket (private or public based on your needs)

### 2. Get API Credentials

1. Navigate to "App Keys" in your Backblaze account
2. Create a new application key
3. Choose access level:
   - For single bucket: Select "Allow access to only one bucket"
   - Select your bucket from dropdown
   - Choose permissions (Read and Write recommended)
4. Save the Key ID and Application Key

### 3. Configure Environment Variables

Update your `.env` file:

```env
# Backblaze B2 Storage Configuration
B2_KEY_ID=xxxxxxxxxxxxx
B2_APPLICATION_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxx
B2_BUCKET_ID=xxxxxxxxxxxxxxxxxxxxxxxx
B2_BUCKET_NAME=your-bucket-name
```

### 4. Install Dependencies

```bash
npm install backblaze-b2
npm install --save-dev @types/backblaze-b2
```

### 5. Update Your Code

If you have custom image upload logic elsewhere in your codebase, update it to use the new B2 service:

```typescript
import { b2Storage } from './src/shared/services/b2Storage.service';

// Upload a file
const result = await b2Storage.uploadFileFromPath('/path/to/file.jpg', 'hotels/my-hotel-image');
console.log('File URL:', result.downloadUrl);

// Or upload from buffer
const buffer = fs.readFileSync('/path/to/file.jpg');
const result = await b2Storage.uploadFile(buffer, 'hotels/my-hotel-image');
```

## Usage Examples

### Basic File Upload

```typescript
import { b2Storage } from './src/shared/services/b2Storage.service';

async function uploadHotelImage(imagePath: string, hotelId: string) {
  try {
    const fileName = `hotels/${hotelId}/${Date.now()}-image`;
    const result = await b2Storage.uploadFileFromPath(imagePath, fileName);
    
    console.log('Upload successful!');
    console.log('File ID:', result.fileId);
    console.log('Download URL:', result.downloadUrl);
    console.log('File size:', result.size);
    
    return result.downloadUrl;
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
}
```

### List Files in Bucket

```typescript
import { b2Storage } from './src/shared/services/b2Storage.service';

async function listHotelImages(hotelId: string) {
  try {
    const files = await b2Storage.listFiles(`hotels/${hotelId}`, 100);
    console.log('Hotel images:', files);
    return files;
  } catch (error) {
    console.error('Failed to list files:', error);
    throw error;
  }
}
```

### Delete a File

```typescript
import { b2Storage } from './src/shared/services/b2Storage.service';

async function deleteHotelImage(fileId: string, fileName: string) {
  try {
    const result = await b2Storage.deleteFile(fileId, fileName);
    console.log('File deleted:', result.deleted);
    return result;
  } catch (error) {
    console.error('Delete failed:', error);
    throw error;
  }
}
```

### Get File Information

```typescript
import { b2Storage } from './src/shared/services/b2Storage.service';

async function getImageInfo(fileId: string) {
  try {
    const fileInfo = await b2Storage.getFileInfo(fileId);
    console.log('File info:', fileInfo);
    return fileInfo;
  } catch (error) {
    console.error('Failed to get file info:', error);
    throw error;
  }
}
```

## Cost Comparison

### Cloudinary Pricing (as of 2024)
- Free tier: 25 GB storage, 25 GB bandwidth
- Plus plan: $89/month for 100 GB storage

### Backblaze B2 Pricing (as of 2024)
- $0.006/GB/month storage (~$6/TB/month)
- $0.01/GB download bandwidth
- First 1 GB/day download free
- No monthly minimums

**Savings:** Backblaze B2 is significantly cheaper for large storage needs, especially for static file storage with moderate downloads.

## Benefits of Migration

1. **Cost Efficiency**: Pay only for what you use, no monthly plans
2. **S3 Compatible**: Easy integration with S3 tools if needed
3. **Simple Pricing**: Transparent pricing without complex tiers
4. **High Durability**: 99.999999999% durability
5. **Low Latency**: Fast global CDN availability
6. **No Vendor Lock-in**: Standard APIs make future migrations easier

## Important Notes

### Security Considerations

1. **Bucket Access**: Keep your application key secure and never commit it to version control
2. **Private vs Public Buckets**: 
   - Private buckets require signed URLs for access
   - Public buckets allow direct downloads but may incur higher costs
3. **CORS Configuration**: Configure CORS in B2 bucket settings if accessing from browser

### Best Practices

1. **File Naming**: Use unique filenames with timestamps or UUIDs to avoid collisions
2. **Folder Structure**: Organize files logically (e.g., `hotels/{hotelId}/{filename}`)
3. **Cleanup**: Always delete temporary local files after upload
4. **Error Handling**: Implement proper error handling for network failures
5. **Retry Logic**: Consider implementing retry logic for transient failures

### Download Implementation Note

The current `downloadFile()` method is a placeholder. For production use, you'll need to:

1. Fetch the file from the public URL or signed URL
2. Handle authentication properly
3. Stream large files instead of loading into memory

Example implementation:

```typescript
import axios from 'axios';

async downloadFile(fileId: string): Promise<Buffer> {
  const fileInfo = await this.getFileInfo(fileId);
  const downloadUrl = this.getPublicUrl(fileInfo.fileName);
  
  const response = await axios.get(downloadUrl, {
    responseType: 'arraybuffer'
  });
  
  return Buffer.from(response.data);
}
```

## Troubleshooting

### Common Issues

**Issue: Authorization Failed**
- Check that B2_KEY_ID and B2_APPLICATION_KEY are correct
- Ensure the application key has appropriate bucket permissions
- Verify B2_BUCKET_ID matches your bucket

**Issue: Upload Fails**
- Check that the bucket exists and is accessible
- Verify file size doesn't exceed B2 limits (max 5GB per file)
- Ensure proper network connectivity

**Issue: File Not Accessible**
- For private buckets, use signed URLs
- Check CORS settings if accessing from browser
- Verify the download URL format is correct

## Testing

Test the migration with these steps:

1. **Upload Test**: Upload a small test image via the `/upload` endpoint
2. **Download Test**: Access the uploaded file via the returned URL
3. **List Test**: Verify files can be listed from the bucket
4. **Delete Test**: Clean up test files to verify deletion works

```bash
# Test upload endpoint
curl -X POST http://localhost:3000/upload \
  -F "image=@/path/to/test-image.jpg"
```

## Rollback Plan

If you need to rollback to Cloudinary:

1. Reinstall cloudinary: `npm install cloudinary`
2. Restore old environment variables
3. Revert code changes using git
4. Update TypeScript types

However, Backblaze B2 provides better value and performance for most use cases.

## Support

For Backblaze B2 support:
- Documentation: https://www.backblaze.com/b2/docs/
- API Reference: https://www.backblaze.com/b2/docs/quick_command_line.html
- Support Portal: https://www.backblaze.com/company/contact.html

---

**Migration Date**: March 9, 2026  
**Migrated By**: AI Assistant  
**Status**: ✅ Complete
