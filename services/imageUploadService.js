/**
 * Image Upload Service
 * Handles image uploads to Cloudinary with proper validation and error handling
 * Follows project architecture and naming conventions
 */

const cloudinary = require('cloudinary').v2;
const fs = require('fs/promises');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Configure Cloudinary (already configured in app.js, but ensuring it's available here)
require('dotenv').config();

cloudinary.config({
  cloudName: process.env.CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_API_KEY,
  apiSecret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

class ImageUploadService {
  constructor() {
    this.allowedFormats = ['jpg', 'jpeg', 'png', 'webp'];
    this.maxFileSize = 5 * 1024 * 1024; // 5MB
    this.maxFiles = 10; // Maximum files per upload
  }

  /**
   * Validate image file
   * @param {Object} file - File object from multer or express-fileupload
   * @returns {Object} Validation result
   */
  validateImage(file) {
    const errors = [];

    // Check file size
    if (file.size > this.maxFileSize) {
      errors.push(`File size exceeds ${this.maxFileSize / 1024 / 1024}MB limit`);
    }

    // Check file format
    const fileExtension = file.name ? 
      file.name.split('.').pop().toLowerCase() : 
      file.originalname.split('.').pop().toLowerCase();
    
    if (!this.allowedFormats.includes(fileExtension)) {
      errors.push(`File format must be one of: ${this.allowedFormats.join(', ')}`);
    }

    // Check MIME type
    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/webp'
    ];

    if (file.mimetype && !allowedMimeTypes.includes(file.mimetype)) {
      errors.push('Invalid file type. Only images are allowed');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Upload single image to Cloudinary
   * @param {Object} file - File object
   * @param {Object} options - Upload options
   * @returns {Promise<Object>} Upload result
   */
  async uploadSingle(file, options = {}) {
    try {
      // Validate file
      const validation = this.validateImage(file);
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      const {
        folder = 'hospitality-mgmt',
        entityType = 'general',
        entityId = null,
        transformation = null
      } = options;

      // Generate unique public_id
      const publicId = `${folder}/${entityType}/${entityId || uuidv4()}/${Date.now()}`;

      let uploadOptions = {
        public_id: publicId,
        folder: folder,
        resource_type: 'image',
        overwrite: false,
        unique_filename: true,
      };

      // Add transformation if provided
      if (transformation) {
        uploadOptions.transformation = transformation;
      }

      let uploadResult;

      // Handle different file input types (multer vs express-fileupload)
      if (file.tempFilePath) {
        // express-fileupload file
        uploadResult = await cloudinary.uploader.upload(file.tempFilePath, uploadOptions);
        // Clean up temp file
        await fs.unlink(file.tempFilePath).catch(err => 
          console.error('Error cleaning temp file:', err)
        );
      } else if (file.path) {
        // multer file
        uploadResult = await cloudinary.uploader.upload(file.path, uploadOptions);
        // Clean up temp file
        await fs.unlink(file.path).catch(err => 
          console.error('Error cleaning temp file:', err)
        );
      } else if (file.buffer) {
        // Buffer upload
        uploadResult = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            uploadOptions,
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          ).end(file.buffer);
        });
      } else {
        throw new Error('Invalid file format provided');
      }

      return {
        success: true,
        data: {
          publicId: uploadResult.public_id,
          secureUrl: uploadResult.secure_url,
          url: uploadResult.url,
          format: uploadResult.format,
          width: uploadResult.width,
          height: uploadResult.height,
          bytes: uploadResult.bytes,
          createdAt: uploadResult.created_at
        }
      };

    } catch (error) {
      console.error('Image upload error:', error);
      throw new Error(`Upload failed: ${error.message}`);
    }
  }

  /**
   * Upload multiple images
   * @param {Array} files - Array of file objects
   * @param {Object} options - Upload options
   * @returns {Promise<Object>} Upload results
   */
  async uploadMultiple(files, options = {}) {
    try {
      if (!Array.isArray(files)) {
        files = [files];
      }

      if (files.length > this.maxFiles) {
        throw new Error(`Cannot upload more than ${this.maxFiles} files at once`);
      }

      const uploadPromises = files.map(async (file, index) => {
        try {
          const fileOptions = {
            ...options,
            entityId: options.entityId ? `${options.entityId}_${index}` : undefined
          };
          return await this.uploadSingle(file, fileOptions);
        } catch (error) {
          return {
            success: false,
            error: error.message,
            fileName: file.name || file.originalname || `file_${index}`
          };
        }
      });

      const results = await Promise.all(uploadPromises);
      
      const successful = results.filter(r => r.success);
      const failed = results.filter(r => !r.success);

      return {
        success: failed.length === 0,
        uploaded: successful.length,
        failed: failed.length,
        results: {
          successful: successful.map(r => r.data),
          failed: failed
        }
      };

    } catch (error) {
      console.error('Multiple upload error:', error);
      throw new Error(`Multiple upload failed: ${error.message}`);
    }
  }

  /**
   * Delete image from Cloudinary
   * @param {string} publicId - Public ID of the image to delete
   * @returns {Promise<Object>} Deletion result
   */
  async deleteImage(publicId) {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      
      return {
        success: result.result === 'ok',
        result: result.result,
        publicId
      };

    } catch (error) {
      console.error('Image deletion error:', error);
      throw new Error(`Deletion failed: ${error.message}`);
    }
  }

  /**
   * Delete multiple images
   * @param {Array} publicIds - Array of public IDs
   * @returns {Promise<Object>} Deletion results
   */
  async deleteMultiple(publicIds) {
    try {
      const deletePromises = publicIds.map(async (publicId) => {
        try {
          return await this.deleteImage(publicId);
        } catch (error) {
          return {
            success: false,
            error: error.message,
            publicId
          };
        }
      });

      const results = await Promise.all(deletePromises);
      
      const successful = results.filter(r => r.success);
      const failed = results.filter(r => !r.success);

      return {
        success: failed.length === 0,
        deleted: successful.length,
        failed: failed.length,
        results: {
          successful,
          failed
        }
      };

    } catch (error) {
      console.error('Multiple deletion error:', error);
      throw new Error(`Multiple deletion failed: ${error.message}`);
    }
  }

  /**
   * Get optimized image URLs with transformations
   * @param {string} publicId - Public ID of the image
   * @param {Object} transformations - Transformation options
   * @returns {Object} Transformed URLs
   */
  getTransformedUrls(publicId, transformations = {}) {
    const baseUrl = cloudinary.url(publicId);
    
    return {
      original: baseUrl,
      thumbnail: cloudinary.url(publicId, {
        width: 300,
        height: 200,
        crop: 'fill',
        quality: 'auto',
        fetch_format: 'auto',
        ...transformations.thumbnail
      }),
      medium: cloudinary.url(publicId, {
        width: 800,
        height: 600,
        crop: 'fill',
        quality: 'auto',
        fetch_format: 'auto',
        ...transformations.medium
      }),
      large: cloudinary.url(publicId, {
        width: 1200,
        height: 800,
        crop: 'fill',
        quality: 'auto',
        fetch_format: 'auto',
        ...transformations.large
      })
    };
  }

  /**
   * Get room-specific image transformations
   * @param {string} publicId - Public ID of the image
   * @returns {Object} Room-specific URLs
   */
  getRoomImageUrls(publicId) {
    return this.getTransformedUrls(publicId, {
      thumbnail: { width: 250, height: 200 },
      medium: { width: 600, height: 400 },
      large: { width: 1000, height: 600 }
    });
  }

  /**
   * Get hotel-specific image transformations
   * @param {string} publicId - Public ID of the image
   * @returns {Object} Hotel-specific URLs
   */
  getHotelImageUrls(publicId) {
    return this.getTransformedUrls(publicId, {
      thumbnail: { width: 300, height: 200 },
      medium: { width: 800, height: 500 },
      large: { width: 1200, height: 700 }
    });
  }
}

module.exports = new ImageUploadService();