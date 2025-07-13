const publish = require( './publish' );
const publishBatch = require( './publish_batch' );
const { SNSClient } = require( '@aws-sdk/client-sns' );
const clientProvider = require( '../core/generic_client_provider' );
const createInstance = require( '../core/create_instance' );

const methods = {
  publish,
  publishBatch
};

module.exports = createInstance( clientProvider.bind( null, SNSClient ), methods );
