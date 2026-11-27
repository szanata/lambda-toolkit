import { describe, it, after } from 'node:test';
import { strictEqual, rejects } from 'node:assert';
import { bucket, s3, createKeyspace, putObject, cleanup } from './setup.js';

const key = createKeyspace( 'download' );

describe( 'S3 download', () => {
  after( () => cleanup( key.prefix ) );

  it( 'Should return the object body as an utf-8 string', async () => {
    await putObject( key( 'text.txt' ), 'Olá, açaí ✓' );

    strictEqual( await s3.download( bucket, key( 'text.txt' ) ), 'Olá, açaí ✓' );
  } );

  it( 'Should read the whole stream of a body larger than a single chunk', async () => {
    const body = 'x'.repeat( 1024 * 1024 );
    await putObject( key( 'large.txt' ), body );

    strictEqual( await s3.download( bucket, key( 'large.txt' ) ), body );
  } );

  it( 'Should pass the native args to the request', async () => {
    await putObject( key( 'range.txt' ), '0123456789' );

    strictEqual( await s3.download( bucket, key( 'range.txt' ), { Range: 'bytes=2-4' } ), '234' );
  } );

  it( 'Should reject when the key does not exist', async () => {
    await rejects( s3.download( bucket, key( 'missing.txt' ) ), { name: 'NoSuchKey' } );
  } );
} );
