import { SNSClient, SNSClientConfig } from '@aws-sdk/client-sns';
import { publish } from './publish.js';
import { publishBatch } from './publish_batch.js';
export type { PublishCommandOutput } from './publish.js';
export type { PublishBatchCommandOutput } from './publish_batch.js';

/**
 * SNS: Publish messages to SNS topics.
 */
export interface SNS {
  /**
   * Publish a message to an SNS topic.
   * Returns the MessageId of the published message.
   */
  publish: typeof publish;

  /**
   * Publish a batch of messages to an SNS topic (max 10 messages).
   */
  publishBatch: typeof publishBatch;

  /**
   * Access the underlying SNS client for advanced usage.
   */
  getClient(): SNSClient;

  /**
   * Create a new SNS instance with custom client configuration.
   */
  (config?: SNSClientConfig): SNS;
}

/**
 * SNS: Publish messages to SNS topics.
 */
export const sns: SNS;
