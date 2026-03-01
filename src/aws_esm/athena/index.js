import { AthenaClient } from '@aws-sdk/client-athena';
import { genericClientProvider } from '../core/generic_client_provider.js';
import { query } from './query.js';
import { createInstance } from '../core/create_instance.js';

const methods = {
  query
};

export const athena = createInstance( genericClientProvider.bind( null, AthenaClient ), methods );
