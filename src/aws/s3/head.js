import { HeadObjectCommand } from '@aws-sdk/client-s3';

export const head = async ( client, bucket, key ) =>
  client.send( new HeadObjectCommand( { Bucket: bucket, Key: key } ) );
