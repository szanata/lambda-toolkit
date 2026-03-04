import { DeleteSuppressedDestinationCommand } from '@aws-sdk/client-sesv2';

export const deleteSuppressedDestination = ( client, address ) => client.send( new DeleteSuppressedDestinationCommand( { EmailAddress: address } ) );
