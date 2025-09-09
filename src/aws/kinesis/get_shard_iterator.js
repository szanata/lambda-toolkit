const { GetShardIteratorCommand } = require( '@aws-sdk/client-kinesis' );

module.exports = ( client, streamName, shardId, shardIteratorType, options = {
  startingSequenceNumber: null,
  timestamp: null,
  streamArn: null
} ) =>
  client.send( new GetShardIteratorCommand( {
    StreamName: streamName,
    ShardId: shardId,
    ShardIteratorType: shardIteratorType,
    StartingSequenceNumber: options.startingSequenceNumber,
    Timestamp: options.timestamp,
    StreamARN: options.streamArn
  } ) );
