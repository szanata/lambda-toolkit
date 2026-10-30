import { QueryCommandInput } from '@aws-sdk/lib-dynamodb';

/**
 * Query result from DynamoDB.
 */
export interface DynamoQueryResult<T = Record<string, any>> {
  /** Array of matching items, or null if Select was COUNT */
  items: T[] | null;
  /** Total count of items matching the query */
  count: number;
  /** Pagination token for the next batch (if applicable) */
  nextToken?: string;
}

/**
 * Query items from a DynamoDB table.
 *
 * Supports pagination with automatic token encoding/decoding.
 *
 * @param args QueryCommandInput with TableName, KeyConditionExpression, etc.
 * @param options Query options
 * @returns Query result with items, count, and optional nextToken
 * @throws Error if the operation fails
 *
 * @example
 * ```ts
 * import { aws } from 'lambda-toolkit';
 * const { dynamo } = aws;
 *
 * // Simple query
 * const result = await dynamo.query({
 *   TableName: 'Orders',
 *   KeyConditionExpression: 'userId = :uid',
 *   ExpressionAttributeValues: { ':uid': '123' }
 * });
 * console.log(result.items, result.count);
 *
 * // Recursive pagination (get all results)
 * const allResults = await dynamo.query(
 *   {
 *     TableName: 'Orders',
 *     KeyConditionExpression: 'userId = :uid',
 *     ExpressionAttributeValues: { ':uid': '123' }
 *   },
 *   { recursive: true }
 * );
 * console.log(allResults.items); // all items
 *
 * // Paginated with token
 * const page = await dynamo.query(args);
 * if (page.nextToken) {
 *   const nextPage = await dynamo.query(args, { paginationToken: page.nextToken });
 * }
 * ```
 */
export function query<T = Record<string, any>>(
  args: Partial<QueryCommandInput>,
  options?: { recursive?: boolean; paginationToken?: string | null }
): Promise<DynamoQueryResult<T>>;
