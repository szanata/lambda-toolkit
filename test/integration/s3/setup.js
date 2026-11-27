import { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsV2Command, DeleteObjectsCommand } from '@aws-sdk/client-s3';
import { aws } from 'lambda-toolkit';
import { clientConfig, infraOutput, runPrefix } from '../helpers.js';

export const bucket = infraOutput( 'test_bucket' );

// Native client: seeds, verifies and cleans up, never the library under test
export const nativeS3 = new S3Client( clientConfig );

// Library under test
export const s3 = aws.s3( clientConfig );

/**
 * Creates a key namespace for one test file, under a unique run prefix.
 * @param {String} name The namespace, usually the function being tested
 * @returns {Function} key builder: `key( 'file.txt' )` -> `integration/<run>/<name>/file.txt`
 */
export const createKeyspace = name => {
  const prefix = `${runPrefix()}/${name}`;
  const key = path => `${prefix}/${path}`;
  key.prefix = prefix;
  return key;
};

export const putObject = ( key, body, nativeArgs = {} ) =>
  nativeS3.send( new PutObjectCommand( { ...nativeArgs, Bucket: bucket, Key: key, Body: body } ) );

export const readObject = async key => {
  const response = await nativeS3.send( new GetObjectCommand( { Bucket: bucket, Key: key } ) );
  return {
    body: await response.Body.transformToString(),
    contentType: response.ContentType,
    metadata: response.Metadata
  };
};

export const objectExists = async key => {
  try {
    await nativeS3.send( new GetObjectCommand( { Bucket: bucket, Key: key } ) );
    return true;
  } catch ( error ) {
    if ( error.name === 'NoSuchKey' ) {
      return false;
    }
    throw error;
  }
};

/**
 * Deletes every object under the given prefix.
 * @param {String} prefix The key prefix
 */
export const cleanup = async prefix => {
  const { Contents = [] } = await nativeS3.send( new ListObjectsV2Command( { Bucket: bucket, Prefix: prefix } ) );
  if ( Contents.length > 0 ) {
    await nativeS3.send( new DeleteObjectsCommand( {
      Bucket: bucket,
      Delete: { Objects: Contents.map( ( { Key } ) => ( { Key } ) ) }
    } ) );
  }
};
