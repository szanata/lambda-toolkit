const isSerializable = require( './is_serializable' );
const camelize = require( '../string/camelize' );

const change = ( obj, keepAllCaps ) =>
  !isSerializable( obj ) ? obj : Object.entries( obj ).reduce( ( transformed, [ key, value ] ) => {
    delete transformed[key];
    transformed[camelize( key, { keepAllCaps } )] = typeof value === 'object' ? change( value, keepAllCaps ) : value;
    return transformed;
  }, Array.isArray( obj ) ? [] : {} );

module.exports = ( obj, { keepAllCaps = false } = {} ) => change( obj, keepAllCaps );
