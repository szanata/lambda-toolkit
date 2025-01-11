const { encode, decode } = require( '../core/encoder' );
const startQuery = require( './lib/start_query' );
const getResults = require( './lib/get_results' );

const getQueryExecutionId = async ( { client, nativeArgs, recursive, paginationToken } ) => {
  if ( !recursive && paginationToken ) {
    const { queryExecutionId, token } = decode( paginationToken );
    return { queryExecutionId, token };
  }

  const queryExecutionId = await startQuery( { client, ...nativeArgs } );
  return { queryExecutionId };
};

/**
 * @class Result
 * @type {Object}
 * @property {Object[]} items Each query result row, parsed to a camelized js object
 * @property {String} paginationToken The next pagination token, if recursive = false ans there are more results for the query
 */

/**
 * Executes an Athena Query
 * @param {*} client The native client
 * @param {Object} nativeArgs The native args to start the Athena Query
 * @param {Object=} options Query configuration
 * @param {Boolean=} [options.recursive=false] If to recursive query all results or to return a paginationToken after each page
 * @param {String=} options.paginationToken The pagination token received in the previous call to resume the query (only used when recursive = false)
 * @param {Number=} options.maxResults The maximum number of results per page (only when using pagination token)
 * @returns {Result} The query result
 */
module.exports = async ( client, nativeArgs, options ) => {
  const { recursive = false, paginationToken, maxResults } = options;

  const { queryExecutionId, token } = await getQueryExecutionId( { client, nativeArgs, recursive, paginationToken } );

  const { nextToken, items } = await getResults( { client, queryExecutionId, token, recursive, maxResults } );
  return { paginationToken: nextToken ? encode( { queryExecutionId, token: nextToken } ) : undefined, items };
};
