import { CopyObjectCommand } from '@aws-sdk/client-s3';

export const copy = async ( client, bucket, key, source, nativeArgs ) => {
  const response = await client.send( new CopyObjectCommand( {
    ...nativeArgs,
    Bucket: bucket,
    Key: key,
    CopySource: source
  } ) );
  return response;
};
