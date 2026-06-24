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

const { getObject } = await import( './get_object.js' );

const client = {
  send: mock.fn()
};

const bucket = 'foo-bucket';
const key = 'foo/bar';

describe( 'S3 Get Object Spec', () => {
  beforeEach( () => {
    constructorMock.mock.mockImplementation( () => commandInstance );
  } );

  afterEach( () => {
    mock.restoreAll();
    client.send.mock.resetCalls();
    constructorMock.mock.resetCalls();
  } );

  it( 'Should get an object from S3 and return the raw response', async () => {
    const content = 'Hi there';
    const httpIncomingMessageMock = {
      toArray: async () => [ Buffer.from( content ) ]
    };
    const response = { Body: httpIncomingMessageMock };

    client.send.mock.mockImplementation( () => response );

    const result = await getObject( client, bucket, key, {
      ResponseContentEncoding: 'utf-8'
    } );

    strictEqual( result, response );
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
