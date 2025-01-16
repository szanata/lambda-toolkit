const { QueryCommand } = require( '@aws-sdk/client-timestream-query' );
const { camelize } = require( '../../object' );
const parseItems = require( './parse_items' );

module.exports = async ( client, queryString, { paginationToken = undefined, maxRows = undefined, rawResponse = false } = {} ) => {
  const response = await client.send( new QueryCommand( { QueryString: queryString, NextToken: paginationToken, MaxRows: maxRows } ) );
  return rawResponse ? response : {
    nextToken: response.NextToken,
    count: response.Rows.length,
    items: parseItems( response ),
    queryStatus: camelize( response.QueryStatus )
  };
};
