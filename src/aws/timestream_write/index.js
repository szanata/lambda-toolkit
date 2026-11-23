import { writeRecords } from './write_records.js';
import { TimestreamWriteClient } from '@aws-sdk/client-timestream-write';
import { Agent } from 'node:https';
import { genericClientProvider } from '../core/generic_client_provider.js';
import { createInstance } from '../core/create_instance.js';
import { unwrapOldNativeArgsSyntax } from '../core/utils.js';

const methods = { writeRecords };

export const timestreamWrite =
  createInstance( ( ...args ) => genericClientProvider( TimestreamWriteClient, Object.assign( {
    maxRetries: 10,
    httpOptions: { timeout: 60000, agent: new Agent( { maxSockets: 5000 } ) }
  }, ...unwrapOldNativeArgsSyntax( args, TimestreamWriteClient.name ) ) ), methods );
