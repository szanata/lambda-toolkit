import { SendMessageBatchCommandOutput, SendMessageBatchRequestEntry } from '@aws-sdk/client-sqs';

export type { SendMessageBatchCommandOutput };

/**
 * Send a batch of messages to an SQS queue (max 10 messages).
 * Throws error if any messages fail.
 *
 * @param queue The SQS queue URL
 * @param messages Array of messages (max 10 items)
 * @param messages[].body Message content (string or object, auto-stringified)
 * @param messages[].id Optional message identifier (auto-generated if omitted)
 * @param messages[].nativeArgs Additional SendMessageBatchRequestEntry arguments per message
 * @returns The SDK response with successful and failed message entries
 *
 * @example
 * ```ts
 * import { aws } from 'lambda-toolkit';
 * const { sqs } = aws;
 *
 * const result = await sqs.sendMessageBatch(
 *   'https://sqs.us-east-1.amazonaws.com/123456789/my-queue',
 *   [
 *     { body: { task: 'invoice-1' }, id: 'msg-1' },
 *     { body: { task: 'invoice-2' }, id: 'msg-2' }
 *   ]
 * );
 * ```
 */
export function sendMessageBatch(
  queue: string,
  messages: Array<{
    body: string | object;
    id?: string;
    nativeArgs?: Partial<SendMessageBatchRequestEntry>;
  }>
): Promise<SendMessageBatchCommandOutput>;
