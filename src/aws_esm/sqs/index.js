import { deleteMessage } from './delete_message.js';
import { sendMessage } from './send_message.js';
import { sendMessageBatch } from './send_message_batch.js';
import { SQSClient } from '@aws-sdk/client-sqs';
import { clientProvider } from '../core/generic_client_provider.js';
import { createInstance } from '../core/create_instance.js';

const methods = {
  deleteMessage,
  sendMessage,
  sendMessageBatch
};

export const sqs = createInstance( clientProvider.bind( null, SQSClient ), methods );
