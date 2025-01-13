const { GetObjectCommand } = require( '@aws-sdk/client-s3' );

module.exports = async ( client, bucket, key, nativeArgs ) => {
  const response = await client.send( new GetObjectCommand( {
    ...nativeArgs,
    Bucket: bucket,
    Key: key
  } ) );
  const stream = response.Body;
  return Buffer.concat( await stream.toArray() ).toString( 'utf-8' );
};
