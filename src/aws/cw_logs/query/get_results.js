const { GetQueryResultsCommand } = require( '@aws-sdk/client-cloudwatch-logs' );
const pollingDelay = require( './polling_delay' );
const sleep = t => new Promise( r => setTimeout( () => r(), t ) );

const getResults = async ( { client, command } ) => {
  const { results, status } = await client.send( command );

  console.log( JSON.stringify( results, undefined, 2 ) );
  if ( [ 'Cancelled', 'Failed', 'Timeout', 'Unknown' ].includes( status ) ) {
    throw new Error( `Query status is "${status}"` );
  }

  if ( status === 'Complete' ) {
    return results;
  }

  // Running, Scheduled
  await sleep( pollingDelay );
  return getResults( { client, command } );
};

module.exports = async ( { client, queryId } ) => {
  const command = new GetQueryResultsCommand( { queryId } );
  return getResults( { client, command } );
};
