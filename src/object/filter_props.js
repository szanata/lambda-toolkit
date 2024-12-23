module.exports = ( obj, props ) => Object.fromEntries( Object.entries( obj ).filter( ( [ k ] ) => props.includes( k ) ) );
