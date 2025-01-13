const { getSignedUrl } = require( '@aws-sdk/s3-request-presigner' );
const { GetObjectCommand } = require( '@aws-sdk/client-s3' );

module.exports = async ( client, bucket, key, expiration ) => {
  const getObjectCmd = new GetObjectCommand( { Bucket: bucket, Key: key } );
  const url = await getSignedUrl( client, getObjectCmd, { expiresIn: expiration } );
  return url;
};
