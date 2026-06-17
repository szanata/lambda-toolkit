import { describe, it, mock, beforeEach, afterEach } from 'node:test';
import { strictEqual, deepStrictEqual } from 'node:assert';

const getMock = mock.fn();

mock.module( './get.js', {
  namedExports: {
    get: getMock
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
    getMock.mock.mockImplementation( () => {} );
  } );

  afterEach( () => {
    mock.restoreAll();
    client.send.mock.resetCalls();
    getMock.mock.resetCalls();
  } );

  it( 'Should download a file from S3 and return its content', async () => {
    const content = 'Hi there';
    const httpIncomingMessageMock = {
      toArray: async () => [ Buffer.from( content ) ]
    };

    getMock.mock.mockImplementation( () => ( { Body: httpIncomingMessageMock } ) );

    const result = await download( client, bucket, key, {
      ResponseContentEncoding: 'utf-8'
    } );

    strictEqual( result, content );
    strictEqual( getMock.mock.calls.length, 1 );
    deepStrictEqual( getMock.mock.calls[0].arguments, [ client, bucket, key, { ResponseContentEncoding: 'utf-8' } ] );
  } );
} );
