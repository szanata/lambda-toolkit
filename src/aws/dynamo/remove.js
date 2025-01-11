const { DeleteCommand } = require( '@aws-sdk/lib-dynamodb' );

module.exports = async ( client, tableName, key ) => {
  const { Attributes: item } = await client.send( new DeleteCommand( {
    ReturnValues: 'ALL_OLD',
    TableName: tableName,
    Key: key
  } ) );
  return item;
};
