const { PutObjectCommand } = require( '@aws-sdk/client-s3' );

module.exports = ( client, bucket, key, body, nativeArgs ) =>
  client.send( new PutObjectCommand( {
    ...nativeArgs,
    Bucket: bucket,
    Key: key,
    Body: typeof body === 'string' || Buffer.isBuffer( body ) ? body : JSON.stringify( body )
  } ) );
