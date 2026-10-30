import { DeleteCommandInput } from '@aws-sdk/lib-dynamodb';

/**
 * Delete multiple items from a DynamoDB table in batches.
 *
 * Automatically handles batching (25 items max per batch) and retries unprocessed items.
 *
 * @param tableName Table name
 * @param keys Array of primary key objects to delete
 * @returns True when all items have been deleted
 * @throws Error if the operation fails
 *
 * @example
 * ```ts
 * import { aws } from 'lambda-toolkit';
 * const { dynamo } = aws;
 *
 * const keys = [
 *   { id: '1' },
 *   { id: '2' },
 *   { id: '3' }
 * ];
 *
 * await dynamo.removeBatch('Users', keys);
 * console.log('All items deleted');
 * ```
 */
export function removeBatch(
  tableName: string,
  keys: NonNullable<DeleteCommandInput['Key']>[]
): Promise<true>;
