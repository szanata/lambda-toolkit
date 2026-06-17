import { get } from './get.js';

export const download = async ( client, bucket, key, nativeArgs ) => {
  const response = await get( client, bucket, key, nativeArgs );
  const stream = response.Body;
  return Buffer.concat( await stream.toArray() ).toString( 'utf-8' );
};
