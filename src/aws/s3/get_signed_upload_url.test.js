import { describe, it, mock, beforeEach, afterEach } from 'node:test';
import { strictEqual, deepStrictEqual } from 'node:assert';

const commandInstance = {};
const constructorMock = mock.fn( () => commandInstance );

mock.module( '@aws-sdk/client-s3', {
  namedExports: {
    PutObjectCommand: new Proxy( class PutObjectCommand {}, {
      construct( _, args ) {
        return constructorMock( ...args );
      }
    } )
  }
} );

const getSignedUrlMock = mock.fn();

mock.module( '@aws-sdk/s3-request-presigner', {
  namedExports: {
    getSignedUrl: getSignedUrlMock
  }
} );

const { getSignedUploadUrl } = await import( './get_signed_upload_url.js' );

const client = {
  send: mock.fn()
};

const bucket = 'bucket';
const key = 'key';
const contentType = 'application/json';
const expiration = 360;
const response = 'htts://my-signed-url';

describe( 'S3 Get Signed Upload Url Spec', () => {
  beforeEach( () => {
    constructorMock.mock.mockImplementation( () => commandInstance );
  } );

  afterEach( () => {
    mock.restoreAll();
    client.send.mock.resetCalls();
    constructorMock.mock.resetCalls();
    getSignedUrlMock.mock.resetCalls();
  } );

  it( 'Should get a signed upload url for a file from S3 and return its content', async () => {
    getSignedUrlMock.mock.mockImplementation( () => response );

    const result = await getSignedUploadUrl( client, bucket, key, expiration );

    strictEqual( result, response );
    strictEqual( constructorMock.mock.calls.length, 1 );
    deepStrictEqual( constructorMock.mock.calls[0].arguments[0], { Key: key, Bucket: bucket } );
    strictEqual( getSignedUrlMock.mock.calls.length, 1 );
    deepStrictEqual( getSignedUrlMock.mock.calls[0].arguments, [ client, commandInstance, { expiresIn: expiration } ] );
  } );

  it( 'Should get a signed upload url for a file from S3 with native args and return its content', async () => {
    getSignedUrlMock.mock.mockImplementation( () => response );

    const result = await getSignedUploadUrl( client, bucket, key, expiration, { ContentType: contentType } );

    strictEqual( result, response );
    strictEqual( constructorMock.mock.calls.length, 1 );
    deepStrictEqual( constructorMock.mock.calls[0].arguments[0], { Key: key, Bucket: bucket, ContentType: contentType } );
    strictEqual( getSignedUrlMock.mock.calls.length, 1 );
    deepStrictEqual( getSignedUrlMock.mock.calls[0].arguments, [ client, commandInstance, { expiresIn: expiration } ] );
  } );
} );
