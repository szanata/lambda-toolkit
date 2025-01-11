const { encode, decode } = require( '../core/encoder' );
const { ScanCommand, QueryCommand } = require( '@aws-sdk/lib-dynamodb' );

const query = async ( { client, command, args, recursive, startKey, items = [], count = 0 } ) => {
  const response = await client.send( new command( {
    ...args,
    ...( startKey && { ExclusiveStartKey: startKey } )
  } ) );

  const isCount = args.Select === 'COUNT';
  const hasLimit = Number.isFinite( args.Limit );

  const result = {
    items: isCount ? null : items.concat( response.Items ),
    count: count + response.Count,
    startKey: response.LastEvaluatedKey
  };

  if ( !recursive ) {
    return { items: result.items, count: result.count, ...( result.startKey && { nextToken: encode( result.startKey ) } ) };
  }

  if ( result.startKey && ( isCount || ( hasLimit && result.items.length < args.Limit ) || ( !isCount && !hasLimit ) ) ) {
    return query( { client, command, args, recursive, ...result } );
  }

  if ( isCount ) {
    return { items: null, count: result.count };
  }
  const trimmedItems = result.items.slice( 0, args.Limit );
  return { items: trimmedItems, count: trimmedItems.length };
};

module.exports = async ( client, method, args, options = { recursive: false, paginationToken: null } ) => {
  const command = method === 'scan' ? ScanCommand : QueryCommand;

  return query( { client, command, args, recursive: options.recursive, startKey: decode( options.paginationToken ) } );
};
