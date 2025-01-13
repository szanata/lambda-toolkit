const deleteSuppressedDestination = require( './delete_suppressed_destination' );
const sendEmail = require( './send_email' );
const { SESv2Client } = require( '@aws-sdk/client-sesv2' );
const clientProvider = require( '../core/generic_client_provider' );
const createInstance = require( '../core/create_instance' );

const methods = {
  deleteSuppressedDestination,
  sendEmail
};

module.exports = createInstance( clientProvider.bind( null, SESv2Client ), methods );
