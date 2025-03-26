const parseValue = require( './parse_value' );

module.exports = item =>
  item.reduce( ( row, { field, value } ) =>
    Object.assign( row, {
      [field]: parseValue( value )
    } ), {} );
