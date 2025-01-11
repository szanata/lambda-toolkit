const { GetCommand } = require( '@aws-sdk/lib-dynamodb' );

module.exports = async ( client, nativeArgs ) => {
  const response = await client.send( new GetCommand( nativeArgs ) );
  return response.Item;
};
