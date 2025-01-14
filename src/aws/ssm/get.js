const cacheStorage = require( '../core/cache_storage' );
const { GetParameterCommand } = require( '@aws-sdk/client-ssm' );

module.exports = async ( client, name ) => {
  const key = `SSM_${name}`;
  const cacheValue = cacheStorage.get( key );
  if ( cacheValue ) { return cacheValue; }

  try {
    const response = await client.send( new GetParameterCommand( { Name: name, WithDecryption: true } ) );
    const value = response?.Parameter?.Value;
    cacheStorage.set( key, value );
    return value;
  } catch ( error ) {
    if ( error.constructor.name === 'ParameterNotFound' ) {
      return null;
    }
    throw error;
  }
};
