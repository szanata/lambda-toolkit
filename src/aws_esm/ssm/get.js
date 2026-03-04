import { CacheStorage } from '../core/cache_storage.js';
import { GetParameterCommand } from '@aws-sdk/client-ssm';

export const get = async ( client, name ) => {
  const key = `SSM_${name}`;
  const cacheValue = CacheStorage.get( key );
  if ( cacheValue ) { return cacheValue; }

  try {
    const response = await client.send( new GetParameterCommand( { Name: name, WithDecryption: true } ) );
    const value = response?.Parameter?.Value;
    CacheStorage.set( key, value );
    return value;
  } catch ( error ) {
    if ( error.constructor.name === 'ParameterNotFound' ) {
      return null;
    }
    throw error;
  }
};
