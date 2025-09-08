const { GetRecordsCommand } = require( '@aws-sdk/client-kinesis' );

module.exports = ( client, shardIterator, nativeArgs = {} ) =>
  client.send( new GetRecordsCommand( {
    ...nativeArgs,
    ShardIterator: shardIterator
  } ) );
