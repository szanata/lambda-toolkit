import { CopyObjectCommandOutput, CopyObjectCommandInput } from '@aws-sdk/client-s3';

export type { CopyObjectCommandOutput };

/**
 * Copy an object from one S3 location to another.
 *
 * @param bucket Destination bucket name
 * @param key Destination object key
 * @param source Source location in format `bucket/key`
 * @param nativeArgs Additional CopyObjectCommand arguments (optional)
 * @returns The SDK response
 *
 * @example
 * ```ts
 * import { aws } from 'lambda-toolkit';
 * const { s3 } = aws;
 *
 * const result = await s3.copy(
 *   'my-bucket',
 *   'path/to/destination.json',
 *   'source-bucket/path/to/source.json'
 * );
 * ```
 */
export function copy(
  bucket: string,
  key: string,
  source: string,
  nativeArgs?: Partial<CopyObjectCommandInput>
): Promise<CopyObjectCommandOutput>;
