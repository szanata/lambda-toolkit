import { HeadObjectCommandOutput } from '@aws-sdk/client-s3';

export type { HeadObjectCommandOutput };

/**
 * Get metadata about an S3 object without downloading it.
 *
 * @param bucket Bucket name
 * @param key Object key
 * @returns The SDK response with object metadata (ContentLength, LastModified, etc.)
 *
 * @example
 * ```ts
 * import { aws } from 'lambda-toolkit';
 * const { s3 } = aws;
 *
 * const metadata = await s3.head('my-bucket', 'path/to/file.json');
 * console.log(metadata.ContentLength, metadata.LastModified);
 * ```
 */
export function head(
  bucket: string,
  key: string
): Promise<HeadObjectCommandOutput>;
