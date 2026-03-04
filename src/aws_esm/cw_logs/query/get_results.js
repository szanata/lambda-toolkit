import { GetQueryResultsCommand } from '@aws-sdk/client-cloudwatch-logs';
import { pollingDelay } from './polling_delay.js';
import { sleep } from '../../../utils_esm/sleep.js';

const getResultsRecursive = async ( { client, command } ) => {
  const { results, status } = await client.send( command );

  if ( [ 'Cancelled', 'Failed', 'Timeout', 'Unknown' ].includes( status ) ) {
    throw new Error( `Query status is "${status}"` );
  }

  if ( status === 'Complete' ) {
    return results;
  }

  // Running, Scheduled
  await sleep( pollingDelay );
  return getResultsRecursive( { client, command } );
};

export const getResults = async ( { client, queryId } ) => {
  const command = new GetQueryResultsCommand( { queryId } );
  return getResultsRecursive( { client, command } );
};
