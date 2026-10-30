import { TransactWriteCommandInput, TransactWriteCommandOutput } from '@aws-sdk/lib-dynamodb';

type TransactItem = NonNullable<TransactWriteCommandInput['TransactItems']>[number];

/**
 * Perform transactional writes to DynamoDB.
 *
 * All writes must succeed or none of them are applied.
 *
 * @param items Array of TransactItem (Put, Update, Delete, ConditionCheck)
 * @returns Full TransactWriteCommandOutput
 * @throws Error if any condition fails or the transaction is not processed
 *
 * @example
 * ```ts
 * import { aws } from 'lambda-toolkit';
 * const { dynamo } = aws;
 *
 * const result = await dynamo.transactWrite([
 *   {
 *     Put: {
 *       TableName: 'Users',
 *       Item: { id: '123', name: 'John' }
 *     }
 *   },
 *   {
 *     Update: {
 *       TableName: 'Orders',
 *       Key: { id: '456' },
 *       UpdateExpression: 'SET #s = :s',
 *       ExpressionAttributeNames: { '#s': 'status' },
 *       ExpressionAttributeValues: { ':s': 'processed' }
 *     }
 *   },
 *   {
 *     Delete: {
 *       TableName: 'Temp',
 *       Key: { id: '789' }
 *     }
 *   }
 * ]);
 * ```
 */
export function transactWrite(
  items: TransactItem[]
): Promise<TransactWriteCommandOutput>;
