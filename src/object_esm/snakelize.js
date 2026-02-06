import { isSerializable } from './is_serializable.js';
import { snakelize as snakelizeString } from '../string_esm/snakelize.js';

const change = ( obj, keepAllCaps ) =>
  !isSerializable( obj ) ? obj : Object.entries( obj ).reduce( ( transformed, [ key, value ] ) => {
    delete transformed[key];
    transformed[snakelizeString( key, { keepAllCaps } )] = typeof value === 'object' ? change( value, keepAllCaps ) : value;
    return transformed;
  }, Array.isArray( obj ) ? [] : {} );

export const snakelize = ( obj, { keepAllCaps = false } = {} ) => change( obj, keepAllCaps );
