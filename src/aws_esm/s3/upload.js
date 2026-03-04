import { PutObjectCommand } from '@aws-sdk/client-s3';

export const upload = ( client, bucket, key, body, nativeArgs ) =>
  client.send( new PutObjectCommand( {
    ...nativeArgs,
    Bucket: bucket,
    Key: key,
    Body: typeof body === 'string' || Buffer.isBuffer( body ) ? body : JSON.stringify( body )
  } ) );
