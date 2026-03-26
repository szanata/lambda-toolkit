import { DeleteCommand } from '@aws-sdk/lib-dynamodb';

const parseArgs = args => {
  // native args mode
  if ( args[0] instanceof Object ) {
    return args[0];
  }
  // sugar mode
  return {
    ReturnValues: 'ALL_OLD',
    TableName: args[0],
    Key: args[1]
  };
};

export const remove = async ( client, ...args ) => {
  const response = await client.send( new DeleteCommand( parseArgs( args ) ) );
  return response.Attributes;
};
