import { getSignedUrl as getSignedUrlS3 } from '@aws-sdk/s3-request-presigner';
import { GetObjectCommand } from '@aws-sdk/client-s3';

export const getSignedUrl = async ( client, bucket, key, expiration ) => {
  const getObjectCmd = new GetObjectCommand( { Bucket: bucket, Key: key } );
  const url = await getSignedUrlS3( client, getObjectCmd, { expiresIn: expiration } );
  return url;
};
