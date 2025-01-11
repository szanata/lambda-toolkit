const cacheSym = Symbol.for( 'cache' );
const crypto = require( 'crypto' );

const hash = text => crypto.createHash( 'md5' ).update( text ).digest( 'hex' );

const propOpts = {
  enumerable: false,
  configurable: false,
  writable: false
};

module.exports = {
  set: ( key, value ) => {
    const keySym = Symbol.for( hash( key ) );

    if ( !global[cacheSym] ) {
      Object.defineProperty( global, cacheSym, { ...propOpts, value: {} } );
    }

    Object.defineProperty( global[cacheSym], keySym, { ...propOpts, value } );
  },
  get: key => {
    return global[cacheSym]?.[Symbol.for( hash( key ) )];
  }
};
