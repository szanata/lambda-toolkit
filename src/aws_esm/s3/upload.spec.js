import { describe, it, mock, afterEach } from 'node:test';
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

const { upload } = await import( './upload.js' );

const client = {
  send: mock.fn()
};

const bucket = 'foo-bucket';
const key = 'foo/bar';
const stringContent = 'Hi Mark';
const bufferContent = Buffer.alloc( 1 );
const objectContent = { foo: 'bar' };
const contentType = 'image/jpeg';

describe( 'S3 Upload Spec', () => {
  afterEach( () => {
    mock.restoreAll();
    client.send.mock.resetCalls();
    constructorMock.mock.resetCalls();
  } );

  it( 'Should put a string on S3', async () => {
    constructorMock.mock.mockImplementation( () => commandInstance );

    await upload( client, bucket, key, stringContent, { ContentType: contentType } );

    strictEqual( constructorMock.mock.calls.length, 1 );
    deepStrictEqual( constructorMock.mock.calls[0].arguments[0], { ContentType: contentType, Key: key, Bucket: bucket, Body: stringContent } );
    strictEqual( client.send.mock.calls.length, 1 );
    deepStrictEqual( client.send.mock.calls[0].arguments[0], commandInstance );
  } );

  it( 'Should put a buffer on S3', async () => {
    constructorMock.mock.mockImplementation( () => commandInstance );

    await upload( client, bucket, key, bufferContent, { ContentType: contentType } );

    strictEqual( constructorMock.mock.calls.length, 1 );
    deepStrictEqual( constructorMock.mock.calls[0].arguments[0], { ContentType: contentType, Key: key, Bucket: bucket, Body: bufferContent } );
    strictEqual( client.send.mock.calls.length, 1 );
    deepStrictEqual( client.send.mock.calls[0].arguments[0], commandInstance );
  } );

  it( 'Should put an object on S3', async () => {
    constructorMock.mock.mockImplementation( () => commandInstance );

    await upload( client, bucket, key, objectContent, { ContentType: contentType } );

    strictEqual( constructorMock.mock.calls.length, 1 );
    deepStrictEqual( constructorMock.mock.calls[0].arguments[0], { ContentType: contentType, Key: key, Bucket: bucket, Body: JSON.stringify( objectContent ) } );
    strictEqual( client.send.mock.calls.length, 1 );
    deepStrictEqual( client.send.mock.calls[0].arguments[0], commandInstance );
  } );
} );
