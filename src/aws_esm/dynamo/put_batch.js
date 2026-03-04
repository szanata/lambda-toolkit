import { batchWrite } from './batch_write';

export const putBatch = async ( client, ...args ) => batchWrite( client, 'put', ...args );
