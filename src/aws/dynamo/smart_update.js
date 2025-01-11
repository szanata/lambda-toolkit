const { UpdateCommand } = require( '@aws-sdk/lib-dynamodb' );

module.exports = async ( client, tableName, key, keyValues ) => {
  const { updates, removals, names, values } = Object.entries( keyValues ).reduce( ( args, [ k, value ], index ) => {
    const isRemoval = value === undefined;

    const attrs = k.split( '.' ).map( ( attr, i ) => {
      const arrayPosition = attr.match( /\[(\d+)\]$/ )?.[1];
      return {
        key: `#${attr.replace( /\[\d+\]$|[^a-zA-Z0-9_]/g, '' )}${i}`,
        name: attr.replace( /\[\d+\]$/g, '' ),
        arrayPosition
      };
    } );
    const fullPath = attrs.map( attr => attr.key + ( attr.arrayPosition ? `[${attr.arrayPosition}]` : '' ) ).join( '.' );
    const valueId = `:v${index}`;
    const expAttrNames = attrs.reduce( ( obj, attr ) =>
      Object.assign( {}, obj, { [attr.key]: attr.name } )
    , {} );

    Object.assign( args.names, expAttrNames );

    if ( isRemoval ) {
      args.removals.push( fullPath );
    } else {
      args.updates.push( fullPath + ' = ' + valueId );
      Object.assign( args.values, { [valueId]: value } );
    }

    return args;
  }, { removals: [], updates: [], names: {}, values: {} } );

  const conditionalExpressions = [];
  for ( const k of Object.keys( key ) ) {
    Object.assign( names, { [`#key_${k}`]: k } );
    conditionalExpressions.push( `attribute_exists(#key_${k})` );
  }

  if ( updates.length + removals.length === 0 ) { return null; }

  const expressions = [];
  if ( updates.length ) {
    expressions.push( 'SET ' + updates.join( ', ' ) );
  } if ( removals.length ) {
    expressions.push( 'REMOVE ' + removals.join( ', ' ) );
  }

  const statement = {
    TableName: tableName,
    ReturnValues: 'ALL_NEW',
    Key: key,
    ConditionExpression: conditionalExpressions.join( ' AND ' ),
    UpdateExpression: expressions.join( ' ' ),
    ExpressionAttributeNames: names
  };
  if ( Object.keys( values ).length > 0 ) {
    statement.ExpressionAttributeValues = values;
  }

  try {
    const response = await client.send( new UpdateCommand( statement ) );
    return response.Attributes;
  } catch ( error ) {
    if ( error.constructor.name === 'ConditionalCheckFailedException' ) {
      console.info( 'Fail to update a record that was not found.' );
      return null;
    }
    throw error;
  }
};
