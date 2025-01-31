module.exports = o => Object.fromEntries( Object.entries( o ).filter( ( [ , v ] ) => !Array.isArray( v ) || v.length > 0 ) );
