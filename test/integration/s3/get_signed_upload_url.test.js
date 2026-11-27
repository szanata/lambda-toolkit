import { describe, it, after } from 'node:test';
import { strictEqual } from 'node:assert';
import { bucket, s3, createKeyspace, readObject, cleanup } from './setup.js';

const key = createKeyspace( 'get_signed_upload_url' );

describe( 'S3 getSignedUploadUrl', () => {
  after( () => cleanup( key.prefix ) );

  it( 'Should return a URL that uploads an object with PUT', async () => {
    const url = await s3.getSignedUploadUrl( bucket, key( 'plain.txt' ), 60 );

    const response = await fetch( url, { method: 'PUT', body: 'uploaded content' } );

    strictEqual( response.status, 200 );
    strictEqual( ( await readObject( key( 'plain.txt' ) ) ).body, 'uploaded content' );
  } );

  it( 'Should sign the native args into the URL', async () => {
    const url = await s3.getSignedUploadUrl( bucket, key( 'file.txt' ), 60, { Metadata: { origin: 'integration' } } );

    await fetch( url, { method: 'PUT', body: 'with metadata' } );

    strictEqual( ( await readObject( key( 'file.txt' ) ) ).metadata.origin, 'integration' );
  } );
} );
