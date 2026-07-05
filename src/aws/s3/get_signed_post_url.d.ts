import { PresignedPost } from '@aws-sdk/s3-presigned-post';

export type { PresignedPost };

/**
 * Generate a presigned POST policy for S3 uploads.
 *
 * @param bucket Bucket name
 * @param key Object key
 * @param expiration URL expiration time in seconds (default: 3600)
 * @param nativeArgs Additional presigned post arguments (optional)
 * @returns Object with url and form fields for HTML form-based uploads
 *
 * @example
 * ```ts
 * import { aws } from 'lambda-toolkit';
 * const { s3 } = aws;
 *
 * const { url, fields } = await s3.getSignedPostUrl('my-bucket', 'path/to/file.pdf');
 * // Return to client for HTML form POST
 * ```
 */
export function getSignedPostUrl(
  bucket: string,
  key: string,
  expiration?: number,
  nativeArgs?: Record<string, any>
): Promise<PresignedPost>;
