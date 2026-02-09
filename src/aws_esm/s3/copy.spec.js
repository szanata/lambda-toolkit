import { describe, it, mock, beforeEach, afterEach } from 'node:test';
import { strictEqual, deepStrictEqual } from 'node:assert';

const commandInstance = {};
const constructorMock = mock.fn( () => commandInstance );

mock.module( '@aws-sdk/client-s3', {
  namedExports: {
    CopyObjectCommand: new Proxy( class CopyObjectCommand {}, {
      construct( _, args ) {
        return constructorMock( ...args );
      }
    } )
  }
} );

const { copy } = await import( './copy.js' );

const client = {
  send: mock.fn()
};

const bucket = 'foo-bucket';
const key = 'foo-key.txt';
const source = 'bar-bucket/bar-key.txt';
const response = { Ok: true };

describe( 'S3 copy spec', () => {
  beforeEach( () => {
    constructorMock.mock.mockImplementation( () => commandInstance );
  } );

  afterEach( () => {
    mock.restoreAll();
    client.send.mock.resetCalls();
    constructorMock.mock.resetCalls();
  } );

  it( 'Should copy a file from two s3 places', async () => {
    client.send.mock.mockImplementation( () => response );

    const result = await copy( client, bucket, key, source, {
      ACL: 'Private'
    } );

    strictEqual( result, response );
    strictEqual( client.send.mock.calls.length, 1 );
    deepStrictEqual( client.send.mock.calls[0].arguments[0], commandInstance );
    strictEqual( constructorMock.mock.calls.length, 1 );
    deepStrictEqual( constructorMock.mock.calls[0].arguments[0], {
      ACL: 'Private',
      Bucket: bucket,
      CopySource: source,
      Key: key
    } );
  } );
} );
