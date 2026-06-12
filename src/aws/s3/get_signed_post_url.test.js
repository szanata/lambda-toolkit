import { describe, it, mock, afterEach } from 'node:test';
import { strictEqual, deepStrictEqual } from 'node:assert';

const createPresignedPostMock = mock.fn();

mock.module( '@aws-sdk/s3-presigned-post', {
  namedExports: {
    createPresignedPost: createPresignedPostMock
  }
} );

const { getSignedPostUrl } = await import( './get_signed_post_url.js' );

const client = {};

const bucket = 'bucket';
const key = 'key';
const expiration = 360;
const response = 'htts://my-signed-url';
const fields = {
  success_action_status: '204'
};
const conditions = [
  [ 'eq', '$success_action_status', '204' ],
  [ 'content-length-range', 0, 1048576 ]
];

describe( 'S3 Get Signed Post Url Spec', () => {
  afterEach( () => {
    mock.restoreAll();
    createPresignedPostMock.mock.resetCalls();
  } );

  it( 'Should get a signed post url for a file from S3 and return its content', async () => {
    createPresignedPostMock.mock.mockImplementation( () => response );

    const result = await getSignedPostUrl( client, bucket, key, expiration );

    strictEqual( result, response );
    strictEqual( createPresignedPostMock.mock.calls.length, 1 );
    deepStrictEqual( createPresignedPostMock.mock.calls[0].arguments, [ client, { Bucket: bucket, Key: key, Expires: expiration } ] );
  } );

  it( 'Should get a signed post url for a file from S3 with native args and return its content', async () => {
    createPresignedPostMock.mock.mockImplementation( () => response );

    const result = await getSignedPostUrl( client, bucket, key, expiration, { Fields: fields, Conditions: conditions } );

    strictEqual( result, response );
    strictEqual( createPresignedPostMock.mock.calls.length, 1 );
    deepStrictEqual( createPresignedPostMock.mock.calls[0].arguments, [
      client,
      { Bucket: bucket, Key: key, Expires: expiration, Fields: fields, Conditions: conditions }
    ] );
  } );
} );
