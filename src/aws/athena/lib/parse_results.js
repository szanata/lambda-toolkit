import { parseValue } from './parse_value.js';

/**
 * Athena returns the column names as the first row of the first page only (the request without NextToken).
 * @param {Object} resultSet The native ResultSet
 * @param {Object} [options]
 * @param {Boolean} [options.hasHeaderRow=true] Whether the first row is the column names row, which is discarded
 */
export const parseResults = ( resultSet, { hasHeaderRow = true } = {} ) => {
  const columns = resultSet.ResultSetMetadata.ColumnInfo
    .map( col => ( { name: col.Name, type: col.Type } ) );

  return resultSet.Rows.slice( hasHeaderRow ? 1 : 0 ).map( row => {
    const values = row.Data.map( d => d.VarCharValue );
    return columns.reduce( ( obj, p, i ) => Object.assign( obj, { [p.name]: parseValue( values[i], p.type ) } ), {} );
  } );
};
