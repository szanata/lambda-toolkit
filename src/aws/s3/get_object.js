import { GetObjectCommand } from '@aws-sdk/client-s3';

export const getObject = async ( client, bucket, key, nativeArgs ) => {
  const response = await client.send( new GetObjectCommand( {
    ...nativeArgs,
    Bucket: bucket,
    Key: key
  } ) );
  return response;
};
