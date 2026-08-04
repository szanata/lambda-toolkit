import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetObjectCommand } from '@aws-sdk/client-s3';

export const getSignedDownloadUrl = async ( client, bucket, key, expiration, nativeArgs ) => {
  const getObjectCmd = new GetObjectCommand( {
    ...nativeArgs,
    Bucket: bucket,
    Key: key
  } );
  const url = await getSignedUrl( client, getObjectCmd, { expiresIn: expiration } );
  return url;
};
