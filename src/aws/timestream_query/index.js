import { query } from './query.js';
import { TimestreamQueryClient } from '@aws-sdk/client-timestream-query';
import { Agent } from 'node:https';
import { genericClientProvider } from '../core/generic_client_provider.js';
import { createInstance } from '../core/create_instance.js';

const methods = { query };
const defaultArgs = {
  maxRetries: 10,
  httpOptions: { timeout: 60000, agent: new Agent( { maxSockets: 5000 } ) }
};

export const timestreamQuery =
  createInstance( args => genericClientProvider( TimestreamQueryClient, [ Object.assign( {}, defaultArgs, args ) ] ), methods );
