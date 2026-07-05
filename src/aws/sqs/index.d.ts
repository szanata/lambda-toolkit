import { SQSClient, SQSClientConfig } from '@aws-sdk/client-sqs';
import { sendMessage } from './send_message.js';
import { sendMessageBatch } from './send_message_batch.js';
import { deleteMessage } from './delete_message.js';
export type { SendMessageBatchCommandOutput, DeleteMessageCommandOutput } from './send_message_batch.js';

/**
 * SQS: Send and receive messages from Amazon SQS queues.
 */
export interface SQS {
  /**
   * Send a message to an SQS queue.
   */
  sendMessage: typeof sendMessage;

  /**
   * Send a batch of messages to an SQS queue (max 10 messages).
   */
  sendMessageBatch: typeof sendMessageBatch;

  /**
   * Delete a message from an SQS queue.
   */
  deleteMessage: typeof deleteMessage;

  /**
   * Access the underlying SQS client for advanced usage.
   */
  getClient(): SQSClient;

  /**
   * Create a new SQS instance with custom client configuration.
   */
  (config?: SQSClientConfig): SQS;
}

/**
 * SQS: Send and receive messages from Amazon SQS queues.
 */
export const sqs: SQS;
