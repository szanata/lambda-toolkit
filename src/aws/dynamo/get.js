import { GetCommand } from '@aws-sdk/lib-dynamodb';

const parseArgs = args => {
  // native args mode
  if ( args[0] instanceof Object ) {
    return args[0];
  }
  // sugar mode
  return {
    TableName: args[0],
    Key: args[1]
  };
};

export const get = async ( client, ...args ) => {
  const response = await client.send( new GetCommand( parseArgs( args ) ) );
  return response.Item;
};
