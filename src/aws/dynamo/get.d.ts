import { GetCommandInput } from '@aws-sdk/lib-dynamodb';

/**
 * Get a single item from a DynamoDB table by key.
 *
 * @param tableName Table name
 * @param key Primary key object
 * @returns The item if found, or undefined if not found
 * @throws Error if the operation fails
 *
 * @example
 * ```ts
 * import { aws } from 'lambda-toolkit';
 * const { dynamo } = aws;
 *
 * // Using sugar syntax
 * const item = await dynamo.get('Users', { id: '123' });
 * console.log(item); // { id: '123', name: 'John', ... } or undefined
 *
 * // Using native args
 * const item2 = await dynamo.get({
 *   TableName: 'Users',
 *   Key: { id: '123' },
 *   ProjectionExpression: 'id,name'
 * });
 * ```
 */
export function get(
  tableName: string,
  key: Record<string, any>
): Promise<Record<string, any> | undefined>;

/**
 * Get a single item from a DynamoDB table using full GetCommandInput.
 *
 * @param nativeArgs Full GetCommandInput configuration
 * @returns The item if found, or undefined if not found
 */
export function get(nativeArgs: Partial<GetCommandInput>): Promise<Record<string, any> | undefined>;
