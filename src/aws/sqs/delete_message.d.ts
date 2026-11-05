import { DeleteMessageCommandOutput } from '@aws-sdk/client-sqs';

export type { DeleteMessageCommandOutput };

/**
 * Delete a message from an SQS queue.
 *
 * @param queue The SQS queue URL
 * @param receiptHandle The ReceiptHandle of the message to delete
 * @returns The SDK response
 *
 * @example
 * ```ts
 * import { aws } from 'lambda-toolkit';
 * const { sqs } = aws;
 *
 * await sqs.deleteMessage(
 *   'https://sqs.us-east-1.amazonaws.com/123456789/my-queue',
 *   'MessageReceiptHandle'
 * );
 * ```
 */
export function deleteMessage(
  queue: string,
  receiptHandle: string
): Promise<DeleteMessageCommandOutput>;
