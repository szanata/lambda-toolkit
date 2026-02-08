import { QueryCommand } from '@aws-sdk/client-timestream-query';
import { camelize } from '../../object/index.js';
import { parseItems } from './parse_items.js';

const sendQuery = async ( client, queryString, { prevItems = [], recursive, paginationToken, maxRows, rawResponse } ) => {
  const response = await client.send( new QueryCommand( { QueryString: queryString, NextToken: paginationToken, MaxRows: maxRows } ) );
  if ( !recursive && rawResponse ) {
    return response;
  }

  const nextToken = response.NextToken;
  if ( nextToken && recursive ) {
    return sendQuery( client, queryString, { prevItems: parseItems( response ), recursive, paginationToken: nextToken, maxRows } );
  }

  const items = prevItems.concat( parseItems( response ) );
  return { nextToken, count: items.length, items, queryStatus: camelize( response.QueryStatus ) };
};

export const query = async ( client, queryString, { recursive = false, paginationToken = undefined, maxRows = undefined, rawResponse = false } = {} ) =>
  sendQuery( client, queryString, { recursive, paginationToken, maxRows, rawResponse } );
