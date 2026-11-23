import { query } from './query.js';
import { TimestreamQueryClient } from '@aws-sdk/client-timestream-query';
import { Agent } from 'node:https';
import { genericClientProvider } from '../core/generic_client_provider.js';
import { createInstance } from '../core/create_instance.js';
import { unwrapOldNativeArgsSyntax } from '../core/utils.js';

const methods = { query };

export const timestreamQuery =
  createInstance( ( ...args ) => genericClientProvider( TimestreamQueryClient,
    Object.assign( {
      maxRetries: 10,
      httpOptions: { timeout: 60000, agent: new Agent( { maxSockets: 5000 } ) }
    }, ...unwrapOldNativeArgsSyntax( args, TimestreamQueryClient.name ) ) ), methods );
