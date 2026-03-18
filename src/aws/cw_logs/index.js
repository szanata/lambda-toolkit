import { CloudWatchLogsClient } from '@aws-sdk/client-cloudwatch-logs';
import { genericClientProvider } from '../core/generic_client_provider.js';
import { createInstance } from '../core/create_instance.js';
import { query } from './query/index.js';

const methods = {
  query
};

export const cwLogs = createInstance( genericClientProvider.bind( null, CloudWatchLogsClient ), methods );
