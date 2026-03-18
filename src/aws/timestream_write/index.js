import { writeRecords } from './write_records.js';
import { TimestreamWriteClient } from '@aws-sdk/client-timestream-write';
<<<<<<< HEAD
import { Agent } from 'node:https';
=======
import { Agent } from 'https';
>>>>>>> 3184e33 (refactor: remove CJS files (#50))
import { genericClientProvider } from '../core/generic_client_provider.js';
import { createInstance } from '../core/create_instance.js';

const methods = { writeRecords };
const defaultArgs = {
  maxRetries: 10,
  httpOptions: { timeout: 60000, agent: new Agent( { maxSockets: 5000 } ) }
};

export const timestreamWrite =
  createInstance( args => genericClientProvider( TimestreamWriteClient, [ Object.assign( {}, defaultArgs, args ) ] ), methods );
