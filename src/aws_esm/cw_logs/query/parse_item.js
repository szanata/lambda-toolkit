import { parseValue } from './parse_value.js';

export const parseItem = item =>
  item.reduce( ( row, { field, value } ) =>
    Object.assign( row, {
      [field]: parseValue( value )
    } ), {} );
