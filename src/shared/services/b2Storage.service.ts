/**
 * Backblaze B2 Storage Service
 * Handles file uploads, downloads, and deletions using Backblaze B2 API
 */

import B2 from 'backblaze-b2';
import { config } from '../../config/environment';
import { ReadStream } from 'fs';

export interface UploadResult {
  fileId: string;
  fileName: string;
  bucketId: string;
  size: number;
  downloadUrl: string;
  contentType?: string;
}

export interface DeleteResult {
  fileId: string;
  fileName: string;
  deleted: boolean;
}

class B2StorageService {
  private b2: B2;
  private bucketId: string;
  private bucketName: string;

  constructor() {
    this.b2 = new B2({
      applicationKeyId: config.b2.keyId,
      applicationKey: config.b2.applicationKey,
    });

    this.bucketId = config.b2.bucketId;
    this.bucketName = config.b2.bucketName;
  }

  /**
   * Authorize with Backblaze B2
   */
  private async authorize(): Promise<void> {
    try {
      await this.b2.authorize();
    } catch (error: any) {
      console.error('B2 Authorization Error:', error.message);
      throw new Error(`Failed to authorize with Backblaze B2: ${error.message}`);
    }
  }

  /**
   * Get upload URL for the bucket
   */
  private async getUploadUrl(): Promise<string> {
    await this.authorize();
    const response = await this.b2.getUploadUrl({ bucketId: this.bucketId });
    return response.data.uploadUrl;
  }

  /**
   * Upload a file to Backblaze B2
   * @param fileBuffer - File buffer
   * @param fileName - Name to save the file as
   */
  async uploadFile(
    fileBuffer: Buffer,
    fileName: string,
  ): Promise<UploadResult> {
    try {
      const uploadUrl = await this.getUploadUrl();
      
      const uploadResponse = await this.b2.uploadFile({
        uploadUrl,
        uploadAuthToken: (await this.b2.authorize()).data.authorizationToken,
        fileName: `${this.bucketName}/${fileName}`,
        data: fileBuffer,
      });

      const fileInfo = uploadResponse.data;
      
      // Construct download URL
      const downloadUrl = `https://f${fileInfo.bucketId}.backblazeb2.com/file/${this.bucketName}/${fileName}`;

      return {
        fileId: fileInfo.fileId,
        fileName: fileInfo.fileName,
        bucketId: fileInfo.bucketId,
        size: fileInfo.contentLength || 0,
        downloadUrl,
        contentType: fileInfo.contentType,
      };
    } catch (error: any) {
      console.error('B2 Upload Error:', error.message);
      throw new Error(`Failed to upload file to Backblaze B2: ${error.message}`);
    }
  }

  /**
   * Upload a file from a local path
   * @param filePath - Local file path
   * @param fileName - Name to save the file as
   */
  async uploadFileFromPath(
    filePath: string,
    fileName: string,
  ): Promise<UploadResult> {
    const fs = await import('fs/promises');
    const fileBuffer = await fs.readFile(filePath);

    return this.uploadFile(fileBuffer, fileName);
  }

  /**
   * Download a file from Backblaze B2
   * @param fileId - ID of the file to download
   */
  async downloadFile(fileId: string): Promise<Buffer> {
    try {
      await this.authorize();
      
      // For downloads, we need to construct the URL and fetch
      const fileInfo = await this.getFileInfo(fileId);
      const downloadUrl = this.getPublicUrl(fileInfo.fileName);
      
      // In a real implementation, you would fetch the file
      // This is a simplified version
      throw new Error('Download not fully implemented - requires HTTP fetch');
    } catch (error: any) {
      console.error('B2 Download Error:', error.message);
      throw new Error(`Failed to download file from Backblaze B2: ${error.message}`);
    }
  }

  /**
   * Delete a file from Backblaze B2
   * @param fileId - ID of the file to delete
   * @param fileName - Name of the file
   */
  async deleteFile(fileId: string, fileName: string): Promise<DeleteResult> {
    try {
      await this.authorize();
      
      await this.b2.deleteFileVersion({
        fileId,
        fileName,
      });

      return {
        fileId,
        fileName,
        deleted: true,
      };
    } catch (error: any) {
      console.error('B2 Delete Error:', error.message);
      throw new Error(`Failed to delete file from Backblaze B2: ${error.message}`);
    }
  }

  /**
   * List files in the bucket
   * @param prefix - Optional prefix to filter files
   * @param maxFiles - Maximum number of files to return
   */
  async listFiles(prefix?: string, maxFiles: number = 100): Promise<any[]> {
    try {
      await this.authorize();
      
      const params: any = {
        bucketId: this.bucketId,
        maxFileCount: maxFiles,
      };

      if (prefix) {
        params.prefix = prefix;
      }

      const listResponse = await this.b2.listFileNames(params);
      return listResponse.data.files || [];
    } catch (error: any) {
      console.error('B2 List Files Error:', error.message);
      throw new Error(`Failed to list files in Backblaze B2: ${error.message}`);
    }
  }

  /**
   * Get file info by ID
   * @param fileId - ID of the file
   */
  async getFileInfo(fileId: string): Promise<any> {
    try {
      await this.authorize();
      
      const infoResponse = await this.b2.getFileInfo({ fileId });
      return infoResponse.data;
    } catch (error: any) {
      console.error('B2 Get File Info Error:', error.message);
      throw new Error(`Failed to get file info from Backblaze B2: ${error.message}`);
    }
  }

  /**
   * Generate a public download URL for a file
   * @param fileName - Name of the file
   */
  getPublicUrl(fileName: string): string {
    return `https://f${this.bucketId}.backblazeb2.com/file/${this.bucketName}/${fileName}`;
  }
}

// Export singleton instance
export const b2Storage = new B2StorageService();
export default b2Storage;
