/**
 * Generate a signed URL for uploading an object to S3.
 *
 * @param bucket Bucket name
 * @param key Object key
 * @param expiration URL expiration time in seconds (default: 3600)
 * @returns A signed URL string that can be used to upload the object
 *
 * @example
 * ```ts
 * import { aws } from 'lambda-toolkit';
 * const { s3 } = aws;
 *
 * const url = await s3.getSignedUploadUrl('my-bucket', 'path/to/file.pdf', 3600);
 * // Share url with client for upload
 * ```
 */
export function getSignedUploadUrl(
  bucket: string,
  key: string,
  expiration?: number
): Promise<string>;
