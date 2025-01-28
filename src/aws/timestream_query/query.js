const { QueryCommand } = require( '@aws-sdk/client-timestream-query' );
const { camelize } = require( '../../object' );
const parseItems = require( './parse_items' );

const query = async ( client, queryString, { prevItems = [], recursive, paginationToken, maxRows, rawResponse } ) => {
  const response = await client.send( new QueryCommand( { QueryString: queryString, NextToken: paginationToken, MaxRows: maxRows } ) );
  if ( !recursive && rawResponse ) {
    return response;
  }

  const nextToken = response.NextToken;
  if ( nextToken && recursive ) {
    return query( client, queryString, { prevItems: parseItems( response ), recursive, paginationToken: nextToken, maxRows } );
  }

  const items = prevItems.concat( parseItems( response ) );
  return { nextToken, count: items.length, items, queryStatus: camelize( response.QueryStatus ) };
};

module.exports = async ( client, queryString, { recursive = false, paginationToken = undefined, maxRows = undefined, rawResponse = false } = {} ) =>
  query( client, queryString, { recursive, paginationToken, maxRows, rawResponse } );
