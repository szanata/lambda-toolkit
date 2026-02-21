import { TransactWriteCommand } from '@aws-sdk/lib-dynamodb';

export const transactWrite = async ( client, items ) => {
  const response = await client.send( new TransactWriteCommand( { TransactItems: items } ) );
  return response;
};
