import { CacheStorage } from './cache_storage.js';

export const genericClientProvider = ( constructor, args = [] ) => {
  const cacheKey = `${constructor.name}(${args.map( arg => JSON.stringify( arg ) ).join( ',' )})`;
  return CacheStorage.get( cacheKey ) ?? ( () => {
    const client = Reflect.construct( constructor, args );
    CacheStorage.set( cacheKey, client );
    return client;
  } )();
};
