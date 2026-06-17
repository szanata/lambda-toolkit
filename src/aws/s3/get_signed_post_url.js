import { createPresignedPost } from '@aws-sdk/s3-presigned-post';

export const getSignedPostUrl = async ( client, bucket, key, expiration, nativeArgs ) => {
  const url = await createPresignedPost( client, {
    ...nativeArgs,
    Bucket: bucket,
    Key: key,
    Expires: expiration
  } );
  return url;
};
