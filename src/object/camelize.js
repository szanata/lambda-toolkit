import { isSerializable } from './is_serializable.js';
import { camelize as camelizeString } from '../string/camelize.js';

const change = ( obj, keepAllCaps ) =>
  !isSerializable( obj ) ? obj : Object.entries( obj ).reduce( ( transformed, [ key, value ] ) => {
    delete transformed[key];
    transformed[camelizeString( key, { keepAllCaps } )] = typeof value === 'object' ? change( value, keepAllCaps ) : value;
    return transformed;
  }, Array.isArray( obj ) ? [] : {} );

export const camelize = ( obj, { keepAllCaps = false } = {} ) => change( obj, keepAllCaps );
