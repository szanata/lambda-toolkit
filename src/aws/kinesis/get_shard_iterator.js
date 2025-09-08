const { GetShardIteratorCommand } = require( '@aws-sdk/client-kinesis' );

module.exports = ( client, streamName, shardId, shardIteratorType, nativeArgs = {} ) =>
  client.send( new GetShardIteratorCommand( {
    ...nativeArgs,
    StreamName: streamName,
    ShardId: shardId,
    ShardIteratorType: shardIteratorType
  } ) );
