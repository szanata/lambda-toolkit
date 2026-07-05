import { UpdateCommandInput } from '@aws-sdk/lib-dynamodb';

/**
 * Update an item in DynamoDB using full UpdateCommandInput.
 *
 * Note: For simpler updates with automatic expression building, use smartUpdate() instead.
 *
 * @param nativeArgs Full UpdateCommandInput with UpdateExpression, ExpressionAttributeValues, etc.
 * @returns The updated item (defaults to ALL_NEW)
 * @throws Error if the operation fails
 *
 * @example
 * ```ts
 * import { aws } from 'lambda-toolkit';
 * const { dynamo } = aws;
 *
 * const updated = await dynamo.update({
 *   TableName: 'Users',
 *   Key: { id: '123' },
 *   UpdateExpression: 'SET #name = :name, #age = :age',
 *   ExpressionAttributeNames: {
 *     '#name': 'name',
 *     '#age': 'age'
 *   },
 *   ExpressionAttributeValues: {
 *     ':name': 'Jane',
 *     ':age': 30
 *   }
 * });
 * console.log(updated); // The updated item
 *
 * // With condition
 * const updated2 = await dynamo.update({
 *   TableName: 'Orders',
 *   Key: { id: '456' },
 *   UpdateExpression: 'SET #status = :status',
 *   ConditionExpression: '#status <> :active',
 *   ExpressionAttributeNames: { '#status': 'status' },
 *   ExpressionAttributeValues: { ':status': 'processed', ':active': 'active' }
 * });
 * ```
 */
export function update(
  nativeArgs: Partial<UpdateCommandInput>
): Promise<Record<string, any>>;
