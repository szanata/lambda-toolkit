const { randomBytes } = require( 'crypto' );
const { StartQueryExecutionCommand } = require( '@aws-sdk/client-athena' );

/**
 * args : https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/athena/command/StartQueryExecutionCommand/
 * A ClientRequestToken is created automatically
 */
module.exports = async ( { client, ...args } ) => {
  const cmd = new StartQueryExecutionCommand( {
    ClientRequestToken: randomBytes( 16 ).toString( 'hex' ),
    ...args
  } );
  const { QueryExecutionId: queryId } = await client.send( cmd );
  return queryId;
};
