import { GetObjectCommandInput } from '@aws-sdk/client-s3';

/**
 * Download an object from S3 as a UTF-8 string.
 *
 * @param bucket Bucket name
 * @param key Object key
 * @param nativeArgs Additional GetObjectCommand arguments (optional)
 * @returns The file content as a UTF-8 string
 *
 * @example
 * ```ts
 * import { aws } from 'lambda-toolkit';
 * const { s3 } = aws;
 *
 * const content = await s3.download('my-bucket', 'path/to/file.json');
 * const data = JSON.parse(content);
 * ```
 */
export function download(
  bucket: string,
  key: string,
  nativeArgs?: Partial<GetObjectCommandInput>
): Promise<string>;
