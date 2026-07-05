import { PutObjectCommandOutput, PutObjectCommandInput } from '@aws-sdk/client-s3';

export type { PutObjectCommandOutput };

/**
 * Upload an object to S3.
 *
 * @param bucket Bucket name
 * @param key Object key
 * @param body File content (string, Buffer, or object auto-stringified)
 * @param nativeArgs Additional PutObjectCommand arguments (optional)
 * @returns The SDK response
 *
 * @example
 * ```ts
 * import { aws } from 'lambda-toolkit';
 * const { s3 } = aws;
 *
 * const result = await s3.upload('my-bucket', 'path/to/file.json', { data: 'content' });
 * console.log(result.ETag);
 * ```
 */
export function upload(
  bucket: string,
  key: string,
  body: string | Buffer | object,
  nativeArgs?: Partial<PutObjectCommandInput>
): Promise<PutObjectCommandOutput>;
