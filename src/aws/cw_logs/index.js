const { CloudWatchLogsClient } = require( '@aws-sdk/client-cloudwatch-logs' );
const clientProvider = require( '../core/generic_client_provider' );
const query = require( './query' );
const createInstance = require( '../core/create_instance' );

const methods = {
  query
};

module.exports = createInstance( clientProvider.bind( null, CloudWatchLogsClient ), methods );
