/**
 * Image Upload Controller
 * Handles image upload operations for various entities (rooms, hotels, facilities, etc.)
 * Follows project MVC architecture and response format specifications
 */

const imageUploadService = require('../services/imageUploadService');
const { sendSuccess, sendError, sendCreated } = require('../utils/responseHelper');
const { MediaFile } = require('../models');

const imageController = {
  /**
   * Upload single image
   */
  uploadSingle: async (req, res) => {
    try {
      // Files are already validated by middleware
      const files = req.validatedFiles;
      if (!files || files.length === 0) {
        return sendError(res, 'No file provided', 400);
      }

      if (files.length > 1) {
        return sendError(res, 'Only one file allowed for single upload', 400);
      }

      const file = files[0];
      const { entityType = 'general', description } = req.body;
      const entityId = req.entityId || req.body.entityId;

      // Upload to Cloudinary
      const uploadResult = await imageUploadService.uploadSingle(file, {
        folder: 'hospitality-mgmt',
        entityType,
        entityId,
      });

      if (!uploadResult.success) {
        return sendError(res, 'Upload failed', 500, uploadResult.error);
      }

      // Save to database
      const mediaRecord = await MediaFile.create({
        entityType,
        entityId,
        publicId: uploadResult.data.publicId,
        secureUrl: uploadResult.data.secureUrl,
        url: uploadResult.data.url,
        format: uploadResult.data.format,
        width: uploadResult.data.width,
        height: uploadResult.data.height,
        bytes: uploadResult.data.bytes,
        description: description || null,
        uploadedBy: req.userId || null,
      });

      // Generate different sized URLs
      const imageUrls = entityType === 'room' 
        ? imageUploadService.getRoomImageUrls(uploadResult.data.publicId)
        : entityType === 'hotel'
        ? imageUploadService.getHotelImageUrls(uploadResult.data.publicId)
        : imageUploadService.getTransformedUrls(uploadResult.data.publicId);

      const responseData = {
        id: mediaRecord.id,
        publicId: uploadResult.data.publicId,
        urls: imageUrls,
        entityType,
        entityId,
        description: mediaRecord.description,
        format: uploadResult.data.format,
        dimensions: {
          width: uploadResult.data.width,
          height: uploadResult.data.height
        },
        size: uploadResult.data.bytes,
        uploadedAt: mediaRecord.createdAt
      };

      return sendCreated(res, 'Image uploaded successfully', responseData);

    } catch (error) {
      console.error('Single image upload error:', error);
      return sendError(res, 'Image upload failed', 500, error.message);
    }
  },

  /**
   * Upload multiple images
   */
  uploadMultiple: async (req, res) => {
    try {
      const files = req.validatedFiles;
      if (!files || files.length === 0) {
        return sendError(res, 'No files provided', 400);
      }

      const { entityType = 'general', descriptions } = req.body;
      const entityId = req.entityId || req.body.entityId;

      // Upload to Cloudinary
      const uploadResult = await imageUploadService.uploadMultiple(files, {
        folder: 'hospitality-mgmt',
        entityType,
        entityId,
      });

      const mediaRecords = [];
      const responseData = [];

      // Process successful uploads
      for (let i = 0; i < uploadResult.results.successful.length; i++) {
        const result = uploadResult.results.successful[i];
        const description = descriptions && descriptions[i] ? descriptions[i] : null;

        try {
          // Save to database
          const mediaRecord = await MediaFile.create({
            entityType,
            entityId,
            publicId: result.publicId,
            secureUrl: result.secureUrl,
            url: result.url,
            format: result.format,
            width: result.width,
            height: result.height,
            bytes: result.bytes,
            description,
            uploadedBy: req.userId || null,
          });

          mediaRecords.push(mediaRecord);

          // Generate different sized URLs
          const imageUrls = entityType === 'room' 
            ? imageUploadService.getRoomImageUrls(result.publicId)
            : entityType === 'hotel'
            ? imageUploadService.getHotelImageUrls(result.publicId)
            : imageUploadService.getTransformedUrls(result.publicId);

          responseData.push({
            id: mediaRecord.id,
            publicId: result.publicId,
            urls: imageUrls,
            entityType,
            entityId,
            description: mediaRecord.description,
            format: result.format,
            dimensions: {
              width: result.width,
              height: result.height
            },
            size: result.bytes,
            uploadedAt: mediaRecord.createdAt
          });

        } catch (dbError) {
          console.error('Database save error:', dbError);
          // Try to cleanup uploaded image
          try {
            await imageUploadService.deleteImage(result.publicId);
          } catch (cleanupError) {
            console.error('Cleanup error:', cleanupError);
          }
        }
      }

      const response = {
        uploaded: responseData.length,
        failed: uploadResult.results.failed.length,
        images: responseData
      };

      if (uploadResult.results.failed.length > 0) {
        response.failures = uploadResult.results.failed;
      }

      return sendCreated(res, `${responseData.length} images uploaded successfully`, response);

    } catch (error) {
      console.error('Multiple image upload error:', error);
      return sendError(res, 'Multiple image upload failed', 500, error.message);
    }
  },

  /**
   * Get images for an entity
   */
  getEntityImages: async (req, res) => {
    try {
      const { entityType, entityId } = req.params;

      const images = await MediaFile.findAll({
        where: {
          entityType,
          entityId,
        },
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'deletedAt'],
        },
        order: [['createdAt', 'DESC']],
      });

      if (images.length === 0) {
        return sendSuccess(res, 'No images found for this entity', []);
      }

      // Transform response to include different sized URLs
      const transformedImages = images.map(image => {
        const imageUrls = entityType === 'room' 
          ? imageUploadService.getRoomImageUrls(image.publicId)
          : entityType === 'hotel'
          ? imageUploadService.getHotelImageUrls(image.publicId)
          : imageUploadService.getTransformedUrls(image.publicId);

        return {
          id: image.id,
          publicId: image.publicId,
          urls: imageUrls,
          description: image.description,
          format: image.format,
          dimensions: {
            width: image.width,
            height: image.height
          },
          size: image.bytes,
          uploadedAt: image.createdAt
        };
      });

      return sendSuccess(res, 'Images retrieved successfully', {
        count: transformedImages.length,
        images: transformedImages
      });

    } catch (error) {
      console.error('Get entity images error:', error);
      return sendError(res, 'Failed to retrieve images', 500, error.message);
    }
  },

  /**
   * Delete single image
   */
  deleteImage: async (req, res) => {
    try {
      const { id } = req.params;

      // Find image in database
      const image = await MediaFile.findByPk(id);
      if (!image) {
        return sendError(res, 'Image not found', 404);
      }

      // Delete from Cloudinary
      const deleteResult = await imageUploadService.deleteImage(image.publicId);
      
      if (!deleteResult.success) {
        console.warn('Cloudinary deletion failed, but continuing with DB deletion');
      }

      // Delete from database
      await image.destroy();

      return sendSuccess(res, 'Image deleted successfully', {
        id: image.id,
        publicId: image.publicId,
        cloudinaryDeleted: deleteResult.success
      });

    } catch (error) {
      console.error('Delete image error:', error);
      return sendError(res, 'Failed to delete image', 500, error.message);
    }
  },

  /**
   * Delete multiple images
   */
  deleteMultiple: async (req, res) => {
    try {
      const { imageIds } = req.body;

      if (!Array.isArray(imageIds) || imageIds.length === 0) {
        return sendError(res, 'Image IDs array is required', 400);
      }

      // Find images in database
      const images = await MediaFile.findAll({
        where: {
          id: imageIds
        }
      });

      if (images.length === 0) {
        return sendError(res, 'No images found with provided IDs', 404);
      }

      const publicIds = images.map(img => img.publicId);
      
      // Delete from Cloudinary
      const cloudinaryResult = await imageUploadService.deleteMultiple(publicIds);

      // Delete from database
      const dbDeletedCount = await MediaFile.destroy({
        where: {
          id: imageIds
        }
      });

      return sendSuccess(res, 'Images deletion completed', {
        requested: imageIds.length,
        found: images.length,
        deleted: dbDeletedCount,
        cloudinaryDeleted: cloudinaryResult.deleted,
        cloudinaryFailed: cloudinaryResult.failed
      });

    } catch (error) {
      console.error('Delete multiple images error:', error);
      return sendError(res, 'Failed to delete images', 500, error.message);
    }
  },

  /**
   * Update image metadata
   */
  updateImage: async (req, res) => {
    try {
      const { id } = req.params;
      const { description } = req.body;

      const image = await MediaFile.findByPk(id);
      if (!image) {
        return sendError(res, 'Image not found', 404);
      }

      // Update image metadata
      await image.update({
        description: description || image.description,
      });

      // Generate response with URLs
      const imageUrls = image.entityType === 'room' 
        ? imageUploadService.getRoomImageUrls(image.publicId)
        : image.entityType === 'hotel'
        ? imageUploadService.getHotelImageUrls(image.publicId)
        : imageUploadService.getTransformedUrls(image.publicId);

      const responseData = {
        id: image.id,
        publicId: image.publicId,
        urls: imageUrls,
        description: image.description,
        format: image.format,
        dimensions: {
          width: image.width,
          height: image.height
        },
        size: image.bytes,
        updatedAt: image.updatedAt
      };

      return sendSuccess(res, 'Image updated successfully', responseData);

    } catch (error) {
      console.error('Update image error:', error);
      return sendError(res, 'Failed to update image', 500, error.message);
    }
  }
};

module.exports = imageController;
