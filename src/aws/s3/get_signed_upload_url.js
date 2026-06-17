import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PutObjectCommand } from '@aws-sdk/client-s3';

export const getSignedUploadUrl = async ( client, bucket, key, expiration, nativeArgs ) => {
  const putObjectCmd = new PutObjectCommand( {
    ...nativeArgs,
    Bucket: bucket,
    Key: key
  } );
  const url = await getSignedUrl( client, putObjectCmd, { expiresIn: expiration } );
  return url;
};
