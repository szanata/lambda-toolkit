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

const { download } = await import( './download.js' );

const client = {
  send: mock.fn()
};

const bucket = 'foo-bucket';
const key = 'foo/bar';

describe( 'S3 Download Spec', () => {
  beforeEach( () => {
    constructorMock.mock.mockImplementation( () => commandInstance );
  } );

  afterEach( () => {
    mock.restoreAll();
    client.send.mock.resetCalls();
    constructorMock.mock.resetCalls();
  } );

  it( 'Should download a file from S3 and return its content', async () => {
    const content = 'Hi there';
    const httpIncomingMessageMock = {
      toArray: async () => [ Buffer.from( content ) ]
    };

    client.send.mock.mockImplementation( () => ( { Body: httpIncomingMessageMock } ) );

    const result = await download( client, bucket, key, {
      ResponseContentEncoding: 'utf-8'
    } );

    strictEqual( result, content );
    strictEqual( client.send.mock.calls.length, 1 );
    deepStrictEqual( client.send.mock.calls[0].arguments[0], commandInstance );
    strictEqual( constructorMock.mock.calls.length, 1 );
    deepStrictEqual( constructorMock.mock.calls[0].arguments[0], {
      ResponseContentEncoding: 'utf-8',
      Key: key,
      Bucket: bucket
    } );
  } );
} );
