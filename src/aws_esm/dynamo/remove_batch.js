import { batchWrite } from './batch_write.js';

export const removeBatch = async ( client, ...args ) => batchWrite( client, 'remove', ...args );
