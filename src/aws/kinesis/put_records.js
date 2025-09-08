const { PutRecordsCommand } = require( '@aws-sdk/client-kinesis' );

module.exports = ( client, streamName, records, nativeArgs = {} ) =>
  client.send( new PutRecordsCommand( {
    ...nativeArgs,
    StreamName: streamName,
    Records: records.map( record => ( {
      ...record,
      Data: typeof record.Data === 'string' || Buffer.isBuffer( record.Data ) ? record.Data : JSON.stringify( record.Data )
    } ) )
  } ) );
