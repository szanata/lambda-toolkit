import { describe, it, mock, beforeEach, afterEach } from 'node:test';
import { strictEqual, deepStrictEqual } from 'node:assert';

const commandInstance = {};
const constructorMock = mock.fn( () => commandInstance );

mock.module( '@aws-sdk/client-s3', {
  namedExports: {
    DeleteObjectCommand: new Proxy( class DeleteObjectCommand {}, {
      construct( _, args ) {
        return constructorMock( ...args );
      }
    } )
  }
} );

const { remove } = await import( './remove.js' );

const client = {
  send: mock.fn()
};

const bucket = 'foo-bucket';
const key = 'foo/bar';
const response = {
  DeleteMarker: true
};

describe( 'S3 Remove Spec', () => {
  beforeEach( () => {
    constructorMock.mock.mockImplementation( () => commandInstance );
  } );

  afterEach( () => {
    mock.restoreAll();
    client.send.mock.resetCalls();
    constructorMock.mock.resetCalls();
  } );

  it( 'Should delete an object from S3 and return the raw response', async () => {
    client.send.mock.mockImplementation( () => response );

    const result = await remove( client, bucket, key );

    strictEqual( result, response );
    strictEqual( client.send.mock.calls.length, 1 );
    deepStrictEqual( client.send.mock.calls[0].arguments[0], commandInstance );
    strictEqual( constructorMock.mock.calls.length, 1 );
    deepStrictEqual( constructorMock.mock.calls[0].arguments[0], { Key: key, Bucket: bucket } );
  } );

  it( 'Should delete an object from S3 using native args', async () => {
    client.send.mock.mockImplementation( () => response );

    const result = await remove( client, bucket, key, { VersionId: 'v1' } );

    strictEqual( result, response );
    strictEqual( client.send.mock.calls.length, 1 );
    deepStrictEqual( constructorMock.mock.calls[0].arguments[0], {
      VersionId: 'v1',
      Key: key,
      Bucket: bucket
    } );
  } );
} );
