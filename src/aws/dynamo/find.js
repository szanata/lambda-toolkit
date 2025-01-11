const { GetCommand } = require( '@aws-sdk/lib-dynamodb' );

module.exports = async ( client, tableName, key ) => {
  const response = await client.send( new GetCommand( { TableName: tableName, Key: key } ) );
  return response.Item;
};
