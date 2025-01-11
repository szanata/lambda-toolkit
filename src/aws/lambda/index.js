const invoke = require( './invoke' );
const { LambdaClient } = require( '@aws-sdk/client-lambda' );
const clientProvider = require( '../core/generic_client_provider' );
const createInstance = require( '../core/create_instance' );

const methods = {
  invoke
};

module.exports = createInstance( clientProvider.bind( null, LambdaClient ), methods );
