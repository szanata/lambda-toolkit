import { ScanCommandInput } from '@aws-sdk/lib-dynamodb';

/**
 * Scan result from DynamoDB.
 */
export interface DynamoScanResult {
  /** Array of matching items, or null if Select was COUNT */
  items: Record<string, any>[] | null;
  /** Total count of items scanned */
  count: number;
  /** Pagination token for the next batch (if applicable) */
  nextToken?: string;
}

/**
 * Scan items from a DynamoDB table.
 *
 * Supports pagination with automatic token encoding/decoding.
 *
 * @param args ScanCommandInput with TableName, FilterExpression, etc.
 * @param options Scan options
 * @returns Scan result with items, count, and optional nextToken
 * @throws Error if the operation fails
 *
 * @example
 * ```ts
 * import { aws } from 'lambda-toolkit';
 * const { dynamo } = aws;
 *
 * // Simple scan
 * const result = await dynamo.scan({
 *   TableName: 'Orders',
 *   Limit: 10
 * });
 * console.log(result.items, result.count);
 *
 * // Recursive scan (get all results)
 * const allResults = await dynamo.scan(
 *   {
 *     TableName: 'Orders',
 *     FilterExpression: 'amount > :min',
 *     ExpressionAttributeValues: { ':min': 100 }
 *   },
 *   { recursive: true }
 * );
 * console.log(allResults.items); // all items matching filter
 *
 * // Paginated with token
 * const page = await dynamo.scan(args);
 * if (page.nextToken) {
 *   const nextPage = await dynamo.scan(args, { paginationToken: page.nextToken });
 * }
 * ```
 */
export function scan(
  args: Partial<ScanCommandInput>,
  options?: { recursive?: boolean; paginationToken?: string | null }
): Promise<DynamoScanResult>;
