import { SendMessageCommandInput } from '@aws-sdk/client-sqs';

/**
 * Send a message to an SQS queue.
 *
 * @param queue The SQS queue URL
 * @param body Message content (string or object, auto-stringified)
 * @param nativeArgs Additional SendMessageCommand arguments (optional)
 * @returns The MessageId of the sent message
 *
 * @example
 * ```ts
 * import { aws } from 'lambda-toolkit';
 * const { sqs } = aws;
 *
 * const messageId = await sqs.sendMessage(
 *   'https://sqs.us-east-1.amazonaws.com/123456789/my-queue',
 *   { task: 'process-invoice' }
 * );
 *
 * console.log(messageId);
 * ```
 */
export function sendMessage(
  queue: string,
  body: string | object,
  nativeArgs?: Partial<SendMessageCommandInput>
): Promise<string>;
