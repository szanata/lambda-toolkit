import { describe, it, mock, beforeEach, afterEach } from 'node:test';
import { strictEqual, deepStrictEqual } from 'node:assert';

const commandInstance = {};
const constructorMock = mock.fn( () => commandInstance );

mock.module( '@aws-sdk/client-s3', {
  namedExports: {
    GetObjectCommand: new Proxy( class GetObjectCommand {}, {
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

const { getSignedUrl } = await import( './get_signed_url.js' );

const client = {
  send: mock.fn()
};

const bucket = 'bucket';
const key = 'key';
const expiration = 360;
const response = 'htts://my-signed-url';

describe( 'S3 Get Signed Url Spec', () => {
  beforeEach( () => {
    constructorMock.mock.mockImplementation( () => commandInstance );
  } );

  afterEach( () => {
    mock.restoreAll();
    client.send.mock.resetCalls();
    constructorMock.mock.resetCalls();
    getSignedUrlMock.mock.resetCalls();
  } );

  it( 'Should getSignedUrl a file from S3 and return its content', async () => {
    getSignedUrlMock.mock.mockImplementation( () => response );

    const result = await getSignedUrl( client, bucket, key, expiration );

    strictEqual( result, response );
    strictEqual( constructorMock.mock.calls.length, 1 );
    deepStrictEqual( constructorMock.mock.calls[0].arguments[0], { Key: key, Bucket: bucket } );
    strictEqual( getSignedUrlMock.mock.calls.length, 1 );
    deepStrictEqual( getSignedUrlMock.mock.calls[0].arguments, [ client, commandInstance, { expiresIn: expiration } ] );
  } );
} );
