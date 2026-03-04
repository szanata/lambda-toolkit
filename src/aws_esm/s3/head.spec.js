import { describe, it, mock, beforeEach, afterEach } from 'node:test';
import { strictEqual, deepStrictEqual } from 'node:assert';

const commandInstance = {};
const constructorMock = mock.fn( () => commandInstance );

mock.module( '@aws-sdk/client-s3', {
  namedExports: {
    HeadObjectCommand: new Proxy( class HeadObjectCommand {}, {
      construct( _, args ) {
        return constructorMock( ...args );
      }
    } )
  }
} );

const { head } = await import( './head.js' );

const client = {
  send: mock.fn()
};

const bucket = 'bucket';
const key = 'key';
const response = {
  ContentType: 'application/json'
};

describe( 'S3 Head Spec', () => {
  beforeEach( () => {
    constructorMock.mock.mockImplementation( () => commandInstance );
  } );

  afterEach( () => {
    mock.restoreAll();
    client.send.mock.resetCalls();
    constructorMock.mock.resetCalls();
  } );

  it( 'Should head a file from S3 and return its content', async () => {
    client.send.mock.mockImplementation( () => response );

    const result = await head( client, bucket, key );

    strictEqual( result, response );
    strictEqual( client.send.mock.calls.length, 1 );
    deepStrictEqual( client.send.mock.calls[0].arguments[0], commandInstance );
    strictEqual( constructorMock.mock.calls.length, 1 );
    deepStrictEqual( constructorMock.mock.calls[0].arguments[0], { Key: key, Bucket: bucket } );
  } );
} );
