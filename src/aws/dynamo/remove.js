import { DeleteCommand } from '@aws-sdk/lib-dynamodb';

export const remove = async ( client, tableName, key ) => {
  const { Attributes: item } = await client.send( new DeleteCommand( {
    ReturnValues: 'ALL_OLD',
    TableName: tableName,
    Key: key
  } ) );
  return item;
};
