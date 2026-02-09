import { get } from './get.js';
import { SSMClient } from '@aws-sdk/client-ssm';
import { clientProvider } from '../core/generic_client_provider.js';
import { createInstance } from '../core/create_instance.js';

const methods = { get };

export const ssm = createInstance( clientProvider.bind( null, SSMClient ), methods );
