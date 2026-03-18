import { batchWrite } from './batch_write.js';

export const putBatch = async ( client, ...args ) => batchWrite( client, 'put', ...args );
