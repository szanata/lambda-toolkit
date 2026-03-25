import { documentClientProvider } from './document_client_provider.js';
import { get } from './get.js';
import { put } from './put.js';
import { putBatch } from './put_batch.js';
import { query } from './query.js';
import { remove } from './remove.js';
import { removeBatch } from './remove_batch.js';
import { scan } from './scan.js';
import { smartUpdate } from './smart_update.js';
import { transactWrite } from './transact_write.js';
import { update } from './update.js';
import { createInstance } from '../core/create_instance.js';

const methods = {
  get,
  put,
  putBatch,
  query,
  remove,
  removeBatch,
  scan,
  smartUpdate,
  transactWrite,
  update
};

export const dynamo = createInstance( documentClientProvider, methods );
