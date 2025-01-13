const { HeadObjectCommand } = require( '@aws-sdk/client-s3' );

module.exports = async ( client, bucket, key ) =>
  client.send( new HeadObjectCommand( { Bucket: bucket, Key: key } ) );
