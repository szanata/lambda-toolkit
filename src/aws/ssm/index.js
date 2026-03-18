import { get } from './get.js';
import { SSMClient } from '@aws-sdk/client-ssm';
import { genericClientProvider } from '../core/generic_client_provider.js';
import { createInstance } from '../core/create_instance.js';

const methods = { get };

export const ssm = createInstance( genericClientProvider.bind( null, SSMClient ), methods );
