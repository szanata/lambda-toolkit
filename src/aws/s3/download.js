import { getObject } from './get_object.js';

export const download = async ( client, bucket, key, nativeArgs ) => {
  const response = await getObject( client, bucket, key, nativeArgs );
  const stream = response.Body;
  return Buffer.concat( await stream.toArray() ).toString( 'utf-8' );
};
