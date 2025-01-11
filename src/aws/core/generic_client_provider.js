const cache = require( '../core/cache_storage' );

module.exports = ( constructor, args = [] ) => {
  const cacheKey = `${constructor.name}(${args.map( arg => JSON.stringify( arg ) ).join( ',' )})`;
  return cache.get( cacheKey ) ?? ( () => {
    const client = Reflect.construct( constructor, args );
    // console.log( 'client', client );
    // const client = new constructor( ...args );
    cache.set( cacheKey, client );
    return client;
  } )();
};
