const { GetQueryExecutionCommand, GetQueryResultsCommand } = require( '@aws-sdk/client-athena' );
const parseResults = require( './parse_results' );
const pollingDelay = require( './polling_delay' );

const sleep = t => new Promise( r => setTimeout( () => r(), t ) );

const getQueryResults = async ( { client, queryExecutionId, maxResults, token } ) => {
  const { NextToken: nextToken, ResultSet } = await client.send( new GetQueryResultsCommand( {
    ...{ QueryExecutionId: queryExecutionId },
    ...( maxResults ? { MaxResults: maxResults } : {} ),
    ...( token ? { NextToken: token } : {} )
  } ) );

  return { nextToken, items: parseResults( ResultSet ) };
};
const getQueryResultsRecursive = async ( { client, queryExecutionId, token } ) => {
  const { nextToken, items } = await getQueryResults( { client, queryExecutionId, token } );

  if ( nextToken ) {
    return { items: items.concat( ( await getQueryResultsRecursive( { client, queryExecutionId, token: nextToken } ) ).items ) };
  }
  return { items };
};

/**
 * https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/athena/command/GetQueryResultsCommand/
 * { client, recursive, queryExecutionId, maxResults, paginationToken }
 */
const getResults = async ( { client, recursive, queryExecutionId, token, maxResults } ) => {
  const { QueryExecution: { Status: status } } = await client.send( new GetQueryExecutionCommand( { QueryExecutionId: queryExecutionId } ) );

  if ( status.State === 'FAILED' ) {
    throw new Error( status.AthenaError?.ErrorMessage ?? status.StateChangeReason );
  }

  if ( status.State === 'SUCCEEDED' ) {
    const fn = recursive ? getQueryResultsRecursive : getQueryResults;
    return fn( { client, recursive, queryExecutionId, token, maxResults } );
  }

  // sleep an try again
  await sleep( pollingDelay );
  return getResults( { client, recursive, queryExecutionId, token, maxResults } );
};

module.exports = getResults;
