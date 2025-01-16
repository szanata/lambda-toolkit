const writeRecords = require( './write_records' );
const { TimestreamWriteClient } = require( '@aws-sdk/client-timestream-write' );
const { Agent } = require( 'https' );
const clientProvider = require( '../core/generic_client_provider' );
const createInstance = require( '../core/create_instance' );

const methods = { writeRecords };
const defaultArgs = {
  maxRetries: 10,
  httpOptions: { timeout: 60000, agent: new Agent( { maxSockets: 5000 } ) }
};

module.exports = createInstance( args => clientProvider( TimestreamWriteClient, [ Object.assign( {}, defaultArgs, args ) ] ), methods );
