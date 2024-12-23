const isSerializable = require( './is_serializable' );
const snakelize = require( '../string/snakelize' );

const change = ( obj, keepAllCaps ) =>
  !isSerializable( obj ) ? obj : Object.entries( obj ).reduce( ( transformed, [ key, value ] ) => {
    delete transformed[key];
    transformed[snakelize( key, { keepAllCaps } )] = typeof value === 'object' ? change( value, keepAllCaps ) : value;
    return transformed;
  }, Array.isArray( obj ) ? [] : {} );

module.exports = ( obj, { keepAllCaps = false } = {} ) => change( obj, keepAllCaps );
