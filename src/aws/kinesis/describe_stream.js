const { DescribeStreamCommand } = require( '@aws-sdk/client-kinesis' );

module.exports = ( client, streamName, options = { limit: null, streamArn: null, exclusiveStartShardId: null } ) =>
  client.send( new DescribeStreamCommand( {
    Limit: options.limit,
    StreamARN: options.streamArn,
    ExclusiveStartShardId: options.exclusiveStartShardId,
    StreamName: streamName
  } ) );
