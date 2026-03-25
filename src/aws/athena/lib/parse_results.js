import { parseValue } from './parse_value.js';

export const parseResults = resultSet => {
  const columns = resultSet.ResultSetMetadata.ColumnInfo
    .map( col => ( { name: col.Name, type: col.Type } ) );

  // first data row contains the table field names
  return resultSet.Rows.slice( 1 ).map( row => {
    const values = row.Data.map( d => d.VarCharValue );
    return columns.reduce( ( obj, p, i ) => Object.assign( obj, { [p.name]: parseValue( values[i], p.type ) } ), {} );
  } );
};
