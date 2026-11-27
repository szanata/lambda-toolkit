import { describe, it, after } from 'node:test';
import { strictEqual } from 'node:assert';
import { bucket, s3, createKeyspace, readObject, cleanup } from './setup.js';

const key = createKeyspace( 'upload' );

describe( 'S3 upload', () => {
  after( () => cleanup( key.prefix ) );

  it( 'Should store an object body as JSON, keeping the native args', async () => {
    const body = { name: 'lambda-toolkit', tags: [ 'aws', 's3' ] };

    await s3.upload( bucket, key( 'object.json' ), body, { ContentType: 'application/json' } );

    const stored = await readObject( key( 'object.json' ) );
    strictEqual( stored.body, JSON.stringify( body ) );
    strictEqual( stored.contentType, 'application/json' );
  } );

  it( 'Should store a string body as is', async () => {
    await s3.upload( bucket, key( 'text.txt' ), 'plain text' );

    strictEqual( ( await readObject( key( 'text.txt' ) ) ).body, 'plain text' );
  } );

  it( 'Should store a Buffer body as is', async () => {
    await s3.upload( bucket, key( 'buffer.bin' ), Buffer.from( 'from buffer' ) );

    strictEqual( ( await readObject( key( 'buffer.bin' ) ) ).body, 'from buffer' );
  } );
} );
