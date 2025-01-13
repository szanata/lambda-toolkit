const documentClientProvider = require( './document_client_provider' );
const get = require( './get' );
const put = require( './put' );
const putBatch = require( './put_batch' );
const query = require( './query' );
const remove = require( './remove' );
const removeBatch = require( './remove_batch' );
const scan = require( './scan' );
const smartUpdate = require( './smart_update' );
const transactWrite = require( './transact_write' );
const update = require( './update' );
const createInstance = require( '../core/create_instance' );

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

module.exports = createInstance( documentClientProvider, methods );
