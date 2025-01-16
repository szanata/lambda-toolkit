const { PutCommand } = require( '@aws-sdk/lib-dynamodb' );

const parseArgs = args => {
  // native args mode
  if ( args[0] instanceof Object ) {
    return args[0];
  }
  // sugar mode
  return {
    TableName: args[0],
    Item: args[1],
    ReturnValues: 'NONE',
    ReturnConsumedCapacity: 'NONE'
  };
};

/**
 *
 * @param {*} client
 * @param  {...any} args The args. either one object with the native args or two string args, tableName and item.
 * @returns
 */
module.exports = async ( client, ...args ) => {
  const nativeArgs = parseArgs( args );
  const response = await client.send( new PutCommand( nativeArgs ) );
  return response.Attributes ?? nativeArgs.Item;
};
