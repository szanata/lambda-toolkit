/**
 * Generate a generic signed URL for S3 operations.
 *
 * @param bucket Bucket name
 * @param key Object key
 * @param method HTTP method for the signed URL (GET, PUT, POST, DELETE, HEAD)
 * @param expiration URL expiration time in seconds (default: 3600)
 * @returns A signed URL string for the specified operation
 *
 * @example
 * ```ts
 * import { aws } from 'lambda-toolkit';
 * const { s3 } = aws;
 *
 * const downloadUrl = await s3.getSignedUrl('my-bucket', 'file.pdf', 'GET', 3600);
 * const uploadUrl = await s3.getSignedUrl('my-bucket', 'file.pdf', 'PUT', 1800);
 * ```
 */
export function getSignedUrl(
  bucket: string,
  key: string,
  method: 'GET' | 'PUT' | 'POST' | 'DELETE' | 'HEAD',
  expiration?: number
): Promise<string>;
