import { describe, it, after } from 'node:test';
import { strictEqual, deepStrictEqual, ok, rejects } from 'node:assert';
import { bucket, s3, createKeyspace, putObject, cleanup } from './setup.js';

const key = createKeyspace( 'head' );

describe( 'S3 head', () => {
  after( () => cleanup( key.prefix ) );

  it( 'Should return the object metadata without the body', async () => {
    await putObject( key( 'file.txt' ), 'content', { ContentType: 'text/plain', Metadata: { owner: 'lambda-toolkit' } } );

    const response = await s3.head( bucket, key( 'file.txt' ) );

    strictEqual( response.ContentLength, 7 );
    strictEqual( response.ContentType, 'text/plain' );
    deepStrictEqual( response.Metadata, { owner: 'lambda-toolkit' } );
    ok( response.ETag );
    strictEqual( response.Body, undefined );
  } );

  it( 'Should reject with NotFound when the key does not exist', async () => {
    await rejects( s3.head( bucket, key( 'missing.txt' ) ), { name: 'NotFound' } );
  } );
} );
