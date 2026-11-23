import { CacheStorage } from './cache_storage.js';
import { unwrapOldNativeArgsSyntax } from './utils.js';

export const genericClientProvider = ( constructor, ...args ) => {
  const callArgs = unwrapOldNativeArgsSyntax( args, constructor.name );
  const cacheArgs = callArgs.map( arg => JSON.stringify( arg ) ).join( ',' );
  const cacheKey = `${constructor.name}(${cacheArgs})`;

  return CacheStorage.get( cacheKey ) ?? ( () => {
    const client = Reflect.construct( constructor, callArgs );
    CacheStorage.set( cacheKey, client );
    return client;
  } )();
};
