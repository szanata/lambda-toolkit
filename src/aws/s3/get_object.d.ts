import { GetObjectCommandOutput, GetObjectCommandInput } from '@aws-sdk/client-s3';

export type { GetObjectCommandOutput };

/**
 * Get an object from S3.
 *
 * @param bucket Bucket name
 * @param key Object key
 * @param nativeArgs Additional GetObjectCommand arguments (optional)
 * @returns The SDK response with Body stream and metadata
 *
 * @example
 * ```ts
 * import { aws } from 'lambda-toolkit';
 * const { s3 } = aws;
 *
 * const response = await s3.getObject('my-bucket', 'path/to/file.json');
 * const content = await response.Body.transformToString();
 * ```
 */
export function getObject(
  bucket: string,
  key: string,
  nativeArgs?: Partial<GetObjectCommandInput>
): Promise<GetObjectCommandOutput>;
