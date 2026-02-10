import { writeRecords } from './write_records.js';
import { TimestreamWriteClient } from '@aws-sdk/client-timestream-write';
import { Agent } from 'https';
import { genericClientProvider } from '../core/generic_client_provider.js';
import { createInstance } from '../core/create_instance.js';

const methods = { writeRecords };
const defaultArgs = {
  maxRetries: 10,
  httpOptions: { timeout: 60000, agent: new Agent( { maxSockets: 5000 } ) }
};

export const timestreamWrite =
  createInstance( args => genericClientProvider( TimestreamWriteClient, [ Object.assign( {}, defaultArgs, args ) ] ), methods );
