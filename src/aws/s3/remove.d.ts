import { DeleteObjectCommandOutput, DeleteObjectCommandInput } from '@aws-sdk/client-s3';

export type { DeleteObjectCommandOutput };

/**
 * Delete an object from S3.
 *
 * On a versioned bucket, removing without `VersionId` adds a delete marker and keeps previous versions.
 * Passing `VersionId` permanently deletes that version.
 *
 * @param bucket Bucket name
 * @param key Object key
 * @param nativeArgs Additional DeleteObjectCommand arguments (optional)
 * @returns The SDK response
 *
 * @example
 * ```ts
 * import { aws } from 'lambda-toolkit';
 * const { s3 } = aws;
 *
 * await s3.remove('my-bucket', 'path/to/file.json');
 *
 * // Permanently delete a specific version
 * await s3.remove('my-bucket', 'path/to/file.json', { VersionId: 'some-version-id' });
 * ```
 */
export function remove(
  bucket: string,
  key: string,
  nativeArgs?: Partial<DeleteObjectCommandInput>
): Promise<DeleteObjectCommandOutput>;
