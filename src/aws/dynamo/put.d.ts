import { PutCommandInput } from '@aws-sdk/lib-dynamodb';

/**
 * Put an item into a DynamoDB table (insert or overwrite).
 *
 * @param tableName Table name
 * @param item The item to put
 * @returns The item that was put, or Attributes if ReturnValues specified
 * @throws Error if the operation fails
 *
 * @example
 * ```ts
 * import { aws } from 'lambda-toolkit';
 * const { dynamo } = aws;
 *
 * // Using sugar syntax (simplest)
 * const result = await dynamo.put('Users', {
 *   id: '123',
 *   name: 'John',
 *   email: 'john@example.com'
 * });
 * console.log(result);
 *
 * // Using native args for more control
 * const result2 = await dynamo.put({
 *   TableName: 'Users',
 *   Item: { id: '123', name: 'John' },
 *   ConditionExpression: 'attribute_not_exists(id)',
 *   ReturnValues: 'ALL_OLD'
 * });
 * ```
 */
export function put<T extends Record<string, any> = Record<string, any>>(
  tableName: string,
  item: T
): Promise<T>;

/**
 * Put an item into a DynamoDB table using full PutCommandInput.
 *
 * @param nativeArgs Full PutCommandInput configuration
 * @returns The item that was put, or Attributes if ReturnValues specified
 */
export function put<T = Record<string, any>>(nativeArgs: Partial<PutCommandInput>): Promise<T>;
