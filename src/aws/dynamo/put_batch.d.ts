/**
 * Put multiple items into a DynamoDB table in batches.
 *
 * Automatically handles batching (25 items max per batch) and retries unprocessed items.
 *
 * @param tableName Table name
 * @param items Array of items to put
 * @returns True when all items have been processed
 * @throws Error if the operation fails
 *
 * @example
 * ```ts
 * import { aws } from 'lambda-toolkit';
 * const { dynamo } = aws;
 *
 * const items = [
 *   { id: '1', name: 'User 1' },
 *   { id: '2', name: 'User 2' },
 *   { id: '3', name: 'User 3' }
 * ];
 *
 * await dynamo.putBatch('Users', items);
 * console.log('All items written');
 * ```
 */
export function putBatch<T extends Record<string, any> = Record<string, any>>(
  tableName: string,
  items: T[]
): Promise<true>;
