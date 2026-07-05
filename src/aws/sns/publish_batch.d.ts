import { PublishBatchCommandOutput, PublishBatchRequestEntry } from '@aws-sdk/client-sns';

export type { PublishBatchCommandOutput };

/**
 * Publish a batch of messages to an SNS topic (max 10 messages).
 * Throws error if any messages fail.
 * 
 * @param topicArn The ARN of the topic to publish to
 * @param messages Array of messages (max 10 items)
 * @returns The SDK response with successful message IDs
 * 
 * @example
 * ```ts
 * import { aws } from 'lambda-toolkit';
 * const { sns } = aws;
 * 
 * const result = await sns.publishBatch(
 *   'arn:aws:sns:us-east-1:123456789:my-topic',
 *   [
 *     { body: { title: 'Message 1' }, id: 'msg-1' },
 *     { body: { title: 'Message 2' }, id: 'msg-2' }
 *   ]
 * );
 * ```
 */
export function publishBatch(
  topicArn: string,
  messages: Array<{
    body: string | object;
    id?: string;
    nativeArgs?: Partial<PublishBatchRequestEntry>;
  }>
): Promise<PublishBatchCommandOutput>;
