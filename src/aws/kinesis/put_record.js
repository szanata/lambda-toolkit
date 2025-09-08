const { PutRecordCommand } = require( '@aws-sdk/client-kinesis' );

module.exports = ( client, streamName, data, partitionKey, nativeArgs = {} ) =>
  client.send( new PutRecordCommand( {
    ...nativeArgs,
    StreamName: streamName,
    Data: typeof data === 'string' || Buffer.isBuffer( data ) ? data : JSON.stringify( data ),
    PartitionKey: partitionKey
  } ) );
