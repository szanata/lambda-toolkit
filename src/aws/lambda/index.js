import { invoke } from './invoke.js';
import { LambdaClient } from '@aws-sdk/client-lambda';
import { genericClientProvider } from '../core/generic_client_provider.js';
import { createInstance } from '../core/create_instance.js';

const methods = {
  invoke
};

export const lambda = createInstance( genericClientProvider.bind( null, LambdaClient ), methods );
