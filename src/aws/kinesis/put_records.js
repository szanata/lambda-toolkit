const { PutRecordsCommand } = require( '@aws-sdk/client-kinesis' );

module.exports = ( client, streamName, records, options = { streamArn: null } ) =>
  client.send( new PutRecordsCommand( {
    StreamARN: options.streamArn,
    StreamName: streamName,
    Records: records.map( record => ( {
      ...record,
      Data: typeof record.Data === 'string' || Buffer.isBuffer( record.Data ) ? record.Data : JSON.stringify( record.Data )
    } ) )
  } ) );
