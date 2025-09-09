const { PutRecordCommand } = require( '@aws-sdk/client-kinesis' );

module.exports = ( client, streamName, data, partitionKey, options = {
  explicitHashKey: null,
  sequenceNumberForOrdering: null,
  streamArn: null
} ) =>
  client.send( new PutRecordCommand( {
    ExplicitHashKey: options.explicitHashKey,
    SequenceNumberForOrdering: options.sequenceNumberForOrdering,
    StreamARN: options.streamArn,
    StreamName: streamName,
    Data: typeof data === 'string' || Buffer.isBuffer( data ) ? data : JSON.stringify( data ),
    PartitionKey: partitionKey
  } ) );
