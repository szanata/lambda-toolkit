import { DeleteObjectCommand } from '@aws-sdk/client-s3';

export const remove = async ( client, bucket, key, nativeArgs ) => {
  const response = await client.send( new DeleteObjectCommand( {
    ...nativeArgs,
    Bucket: bucket,
    Key: key
  } ) );
  return response;
};
