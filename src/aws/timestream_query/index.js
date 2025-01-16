const query = require( './query' );
const { TimestreamQueryClient } = require( '@aws-sdk/client-timestream-query' );
const { Agent } = require( 'https' );
const clientProvider = require( '../core/generic_client_provider' );
const createInstance = require( '../core/create_instance' );

const methods = { query };
const defaultArgs = {
  maxRetries: 10,
  httpOptions: { timeout: 60000, agent: new Agent( { maxSockets: 5000 } ) }
};

module.exports = createInstance( args => clientProvider( TimestreamQueryClient, [ Object.assign( {}, defaultArgs, args ) ] ), methods );
