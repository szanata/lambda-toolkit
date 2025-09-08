const { ListStreamsCommand } = require( '@aws-sdk/client-kinesis' );

module.exports = ( client, nativeArgs = {} ) =>
  client.send( new ListStreamsCommand( nativeArgs ) );
