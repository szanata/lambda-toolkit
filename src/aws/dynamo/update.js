const { UpdateCommand } = require( '@aws-sdk/lib-dynamodb' );

module.exports = async ( client, nativeArgs ) => {
  const args = Object.assign( { ReturnValues: 'ALL_NEW' }, nativeArgs );
  const response = await client.send( new UpdateCommand( args ) );
  return response.Attributes;
};
