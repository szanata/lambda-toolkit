import { describe, it, after } from 'node:test';
import { strictEqual } from 'node:assert';
import { bucket, s3, createKeyspace, putObject, objectExists, cleanup } from './setup.js';

const key = createKeyspace( 'remove' );

describe( 'S3 remove', () => {
  after( () => cleanup( key.prefix ) );

  it( 'Should delete the object', async () => {
    await putObject( key( 'file.txt' ), 'content' );

    await s3.remove( bucket, key( 'file.txt' ) );

    strictEqual( await objectExists( key( 'file.txt' ) ), false );
  } );

  it( 'Should resolve when the key does not exist', async () => {
    const response = await s3.remove( bucket, key( 'missing.txt' ) );

    strictEqual( response.$metadata.httpStatusCode, 204 );
  } );
} );
