import { UpdateCommandInput } from '@aws-sdk/lib-dynamodb';

/**
 * Smart update an item in DynamoDB with automatic expression building.
 *
 * Automatically builds UpdateExpression, ExpressionAttributeNames, and ExpressionAttributeValues
 * from the updates object. Supports nested paths and array indices.
 *
 * @param tableName Table name
 * @param key Primary key object
 * @param updates Object with properties to set (values) or remove (undefined values)
 * @returns The updated item (ALL_NEW), or null if the item doesn't exist
 * @throws Error if the operation fails
 *
 * @example
 * ```ts
 * import { aws } from 'lambda-toolkit';
 * const { dynamo } = aws;
 *
 * // Set multiple properties
 * const updated = await dynamo.smartUpdate('Users', { id: '123' }, {
 *   name: 'Jane',
 *   email: 'jane@example.com',
 *   lastUpdated: Date.now()
 * });
 * console.log(updated);
 *
 * // Remove properties by setting undefined
 * const updated2 = await dynamo.smartUpdate('Users', { id: '123' }, {
 *   name: 'Jane',
 *   tempField: undefined  // This will be removed
 * });
 *
 * // Update nested paths
 * const updated3 = await dynamo.smartUpdate('Users', { id: '123' }, {
 *   'profile.age': 30,
 *   'tags[0]': 'vip'
 * });
 *
 * // Returns null if item doesn't exist
 * const result = await dynamo.smartUpdate('NonExistent', { id: '999' }, { name: 'Test' });
 * if (result === null) {
 *   console.log('Item not found');
 * }
 * ```
 */
export function smartUpdate<T = Record<string, any>>(
  tableName: string,
  key: NonNullable<UpdateCommandInput['Key']>,
  updates: Record<string, any>
): Promise<T | null>;
