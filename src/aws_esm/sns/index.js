import { publish } from './publish.js';
import { publishBatch } from './publish_batch.js';
import { SNSClient } from '@aws-sdk/client-sns';
import { genericClientProvider } from '../core/generic_client_provider.js';
import { createInstance } from '../core/create_instance.js';

const methods = {
  publish,
  publishBatch
};

export const sns = createInstance( genericClientProvider.bind( null, SNSClient ), methods );
