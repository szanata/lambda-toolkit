import { PublishCommandInput, PublishCommandOutput } from '@aws-sdk/client-sns';

export type { PublishCommandOutput };

/**
 * Publish a message to an SNS topic.
 * Returns the MessageId of the published message.
 * 
 * @param topicArn The ARN of the topic to publish to
 * @param message The message content (string or object, auto-stringified)
 * @param nativeArgs Additional SNS PublishCommand arguments (optional)
 * @returns The MessageId of the published message
 * 
 * @example
 * ```ts
 * import { aws } from 'lambda-toolkit';
 * const { sns } = aws;
 * 
 * const messageId = await sns.publish(
 *   'arn:aws:sns:us-east-1:123456789:my-topic',
 *   { title: 'Hello World' }
 * );
 * ```
 */
export function publish(
  topicArn: string,
  message: string | object,
  nativeArgs?: Partial<PublishCommandInput>
): Promise<string>;
