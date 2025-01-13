const { DeleteSuppressedDestinationCommand } = require( '@aws-sdk/client-sesv2' );

module.exports = ( client, address ) => client.send( new DeleteSuppressedDestinationCommand( { EmailAddress: address } ) );
