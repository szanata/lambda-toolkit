const { DescribeStreamCommand } = require( '@aws-sdk/client-kinesis' );

module.exports = ( client, streamName, nativeArgs = {} ) =>
  client.send( new DescribeStreamCommand( {
    ...nativeArgs,
    StreamName: streamName
  } ) );
