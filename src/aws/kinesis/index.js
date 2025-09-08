const putRecord = require( './put_record' );
const putRecords = require( './put_records' );
const getRecords = require( './get_records' );
const getShardIterator = require( './get_shard_iterator' );
const describeStream = require( './describe_stream' );
const listStreams = require( './list_streams' );
const { KinesisClient } = require( '@aws-sdk/client-kinesis' );
const clientProvider = require( '../core/generic_client_provider' );
const createInstance = require( '../core/create_instance' );

const methods = {
  putRecord,
  putRecords,
  getRecords,
  getShardIterator,
  describeStream,
  listStreams
};

module.exports = createInstance( clientProvider.bind( null, KinesisClient ), methods );
