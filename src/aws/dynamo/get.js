import { GetCommand } from '@aws-sdk/lib-dynamodb';

/**
 * @typedef {import("@aws-sdk/lib-dynamodb").GetCommandInput} GetCommandInput
 */

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

/**
 * Parses the arguments for the DynamoDB GetCommand
 *
 * @param {GetCommandInput|string} tableNameOrNativeArgs - The table name or the native GetCommand input object
 * @param {Object} [args] - The key object if the first argument is a table name
 * @returns {Object}
 */
const get = async ( ...args ) => {
  const [ client, ...rest ] = args;
  const response = await client.send( new GetCommand( parseArgs( rest ) ) );
  return response.Item;
};

export {
  get
}
