import { DeleteCommandInput } from '@aws-sdk/lib-dynamodb';

/**
 * Delete a single item from a DynamoDB table by key.
 *
 * @param tableName Table name
 * @param key Primary key object
 * @returns The deleted item attributes (by default returns ALL_OLD)
 * @throws Error if the operation fails
 *
 * @example
 * ```ts
 * import { aws } from 'lambda-toolkit';
 * const { dynamo } = aws;
 *
 * // Using sugar syntax
 * const deleted = await dynamo.remove('Users', { id: '123' });
 * console.log(deleted); // { id: '123', name: 'John', ... }
 *
 * // Using native args
 * const deleted2 = await dynamo.remove({
 *   TableName: 'Users',
 *   Key: { id: '123' },
 *   ConditionExpression: 'attribute_exists(id)'
 * });
 * ```
 */
export function remove<T = Record<string, any>>(
  tableName: string,
  key: NonNullable<DeleteCommandInput['Key']>
): Promise<T | undefined>;

/**
 * Delete a single item from a DynamoDB table using full DeleteCommandInput.
 *
 * @param nativeArgs Full DeleteCommandInput configuration
 * @returns The deleted item attributes (if ReturnValues specified)
 */
export function remove<T = Record<string, any>>(nativeArgs: Partial<DeleteCommandInput>): Promise<T | undefined>;
