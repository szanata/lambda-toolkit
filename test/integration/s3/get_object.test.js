import { describe, it, after } from 'node:test';
import { strictEqual, deepStrictEqual, rejects } from 'node:assert';
import { bucket, s3, createKeyspace, putObject, cleanup } from './setup.js';

const key = createKeyspace( 'get_object' );

describe( 'S3 getObject', () => {
  after( () => cleanup( key.prefix ) );

  it( 'Should return the raw response with body stream and metadata', async () => {
    await putObject( key( 'file.txt' ), 'content', { ContentType: 'text/plain', Metadata: { owner: 'lambda-toolkit' } } );

    const response = await s3.getObject( bucket, key( 'file.txt' ) );

    strictEqual( await response.Body.transformToString(), 'content' );
    strictEqual( response.ContentType, 'text/plain' );
    deepStrictEqual( response.Metadata, { owner: 'lambda-toolkit' } );
  } );

  it( 'Should pass the native args to the request', async () => {
    await putObject( key( 'range.txt' ), '0123456789' );

    const response = await s3.getObject( bucket, key( 'range.txt' ), { Range: 'bytes=0-2' } );

    strictEqual( await response.Body.transformToString(), '012' );
  } );

  it( 'Should reject when the key does not exist', async () => {
    await rejects( s3.getObject( bucket, key( 'missing.txt' ) ), { name: 'NoSuchKey' } );
  } );
} );
