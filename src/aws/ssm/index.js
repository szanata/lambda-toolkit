const get = require( './get' );
const { SSMClient } = require( '@aws-sdk/client-ssm' );
const clientProvider = require( '../core/generic_client_provider' );
const createInstance = require( '../core/create_instance' );

const methods = { get };

module.exports = createInstance( clientProvider.bind( null, SSMClient ), methods );
