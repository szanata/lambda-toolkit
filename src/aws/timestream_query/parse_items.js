// https://docs.aws.amazon.com/timestream/latest/developerguide/API_query_Type.html
// https://docs.aws.amazon.com/timestream/latest/developerguide/supported-data-types.html

const { ScalarType } = require( '@aws-sdk/client-timestream-query' );

const parseBigInt = value => {
  const asInt = parseInt( value, 10 );
  return asInt <= Number.MAX_SAFE_INTEGER && asInt >= Number.MIN_SAFE_INTEGER ? asInt : value;
};

const parseScalarValue = ( type, value ) => {
  switch ( type ) {
  case ScalarType.BOOLEAN:
    return value === 'true';
  case ScalarType.DOUBLE:
    return parseFloat( value );
  case ScalarType.TIMESTAMP:
    return new Date( `${value.replace( ' ', 'T' )}Z` );
  case ScalarType.INTEGER:
    return parseInt( value, 10 );
  case ScalarType.UNKNOWN: // is NULL
    return null;
  case ScalarType.BIGINT:
    return parseBigInt( value );
  case ScalarType.VARCHAR:
  case ScalarType.DATE:
  case ScalarType.TIME:
  case ScalarType.INTERVAL_DAY_TO_SECOND:
  case ScalarType.INTERVAL_YEAR_TO_MONTH:
  default:
    return value;
  }
};

const parseValue = ( typeInfo, datum ) => {
  // value might be null
  if ( datum['NullValue'] === true ) {
    return null;
  }

  // or a time series
  if ( Object.hasOwn( typeInfo, 'TimeSeriesMeasureValueColumnInfo' ) ) {
    return datum.TimeSeriesValue.map( v => ( {
      time: new Date( v.Time ),
      value: parseValue( typeInfo.TimeSeriesMeasureValueColumnInfo.Type, v.Value )
    } ) );
  }

  // maybe an array
  if ( Object.hasOwn( typeInfo, 'ArrayColumnInfo' ) ) {
    return datum.ArrayValue.map( v => parseValue( typeInfo.ArrayColumnInfo.Type, v ) );
  }

  // or even a row
  if ( Object.hasOwn( typeInfo, 'RowColumnInfo' ) ) {
    const rowColumnInfo = typeInfo.RowColumnInfo;
    return datum.RowValue.Data.reduce( ( object, value, index ) => {
      const { Name: name, Type: typeInfo } = rowColumnInfo[index];
      return Object.assign( object, { [name]: parseValue( typeInfo, value ) } );
    }, {} );
  }

  // if none, it is scalar
  return parseScalarValue( typeInfo.ScalarType, datum['ScalarValue'] );
};

module.exports = response => {
  const { ColumnInfo: colInfo, Rows: rows } = response;
  return rows.map( row =>
    row.Data.reduce( ( entry, value, index ) => {
      const { Name: name, Type: typeInfo } = colInfo[index];
      return Object.assign( entry, { [name]: parseValue( typeInfo, value ) } );
    }, { } )
  );
};
