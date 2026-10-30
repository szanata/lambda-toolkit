import { S3Client, S3ClientConfig } from '@aws-sdk/client-s3';
import { copy } from './copy.js';
import { download } from './download.js';
import { getObject } from './get_object.js';
import { getSignedDownloadUrl } from './get_signed_download_url.js';
import { getSignedPostUrl } from './get_signed_post_url.js';
import { getSignedUploadUrl } from './get_signed_upload_url.js';
import { getSignedUrl } from './get_signed_url.js';
import { head } from './head.js';
import { upload } from './upload.js';
export type { CopyObjectCommandOutput } from './copy.js';
export type { GetObjectCommandOutput } from './get_object.js';
export type { PutObjectCommandOutput } from './upload.js';
export type { HeadObjectCommandOutput } from './head.js';
export type { PresignedPost } from './get_signed_post_url.js';

/**
 * S3: Upload, download, and manage objects in S3 buckets.
 */
export interface S3 {
  /**
   * Upload an object to S3.
   */
  upload: typeof upload;

  /**
   * Download an object from S3 as a UTF-8 string.
   */
  download: typeof download;

  /**
   * Get an object from S3.
   */
  getObject: typeof getObject;

  /**
   * Generate a signed URL for downloading an object.
   */
  getSignedDownloadUrl: typeof getSignedDownloadUrl;

  /**
   * Generate a signed URL for uploading an object.
   */
  getSignedUploadUrl: typeof getSignedUploadUrl;

  /**
   * Generate a generic signed URL for S3 operations.
   */
  getSignedUrl: typeof getSignedUrl;

  /**
   * Generate a presigned POST policy for form-based uploads.
   */
  getSignedPostUrl: typeof getSignedPostUrl;

  /**
   * Copy an object from one location to another.
   */
  copy: typeof copy;

  /**
   * Get metadata about an object without downloading it.
   */
  head: typeof head;

  /**
   * Access the underlying S3 client for advanced usage.
   */
  getClient(): S3Client;

  /**
   * Create a new S3 instance with custom client configuration.
   */
  (config?: S3ClientConfig): S3;
}

/**
 * S3: Upload, download, and manage objects in S3 buckets.
 */
export const s3: S3;
