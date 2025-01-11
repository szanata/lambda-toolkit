const { TransactWriteCommand } = require( '@aws-sdk/lib-dynamodb' );

module.exports = async ( client, items ) => {
  const response = await client.send( new TransactWriteCommand( { TransactItems: items } ) );
  return response;
};
