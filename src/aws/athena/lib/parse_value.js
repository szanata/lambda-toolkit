/* eslint consistent-return: 0 */
const removeNullValues = ( o, isArray = Array.isArray( o ) ) =>
  Object.entries( o ).reduce( ( newObj, [ k, v ] ) => {
    if ( v === null && !isArray ) { return newObj; }
    return Object.assign( newObj, { [k]: v?.constructor === Object ? removeNullValues( v ) : v } );
  }, isArray ? [] : {} );

module.exports = ( v, type ) => {
  if ( [ null, undefined ].includes( v ) ) {
    return undefined;
  }
  if ( v === '' && type !== 'varchar' ) {
    return undefined;
  }
  if ( type === 'boolean' ) {
    return v === 'true';
  }
  if ( [ 'float', 'decimal', 'double' ].includes( type ) ) {
    return parseFloat( v );
  }
  if ( [ 'tinyint', 'smallint', 'int', 'bigint' ].includes( type ) ) {
    return parseInt( v );
  }
  if ( 'timestamp' === type ) {
    return new Date( v ).getTime();
  }
  if ( [ 'row', 'array' ].includes( type ) ) {
    const obj = v.replace( /(?<=(?:{|,\s)[\w-_]+)=/g, '@@DELIMITER@@' ) // replaces delimiter = with @@DELIMITER@@
      .replace( /(?<={|,\s)([\w_-]+)(?=@@DELIMITER@@)/g, '"$1"' ) // wrap object keys
      .replace( /(?<=@@DELIMITER@@)((?:(?!,\s|}|\[|{).)+)/g, '"$1"' ) // wrap object values
      .replace( /(?<=\[|,\s)((?:(?!,\s|{|\]|").)+)/g, '"$1"' ) // wrap array values
      .replace( /"null"/g, 'null' ) // convert "null" to null
      .replace( /@@DELIMITER@@/g, ':' ); // replaces @@DELIMITER@@ for :

    return removeNullValues( JSON.parse( obj ) );
  }
  if ( 'json' === type ) {
    return JSON.parse( v );
  }
  return v;
};
