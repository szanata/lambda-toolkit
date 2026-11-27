import { describe, it, after } from 'node:test';
import { strictEqual } from 'node:assert';
import { bucket, s3, createKeyspace, readObject, objectExists, cleanup } from './setup.js';

const key = createKeyspace( 'get_signed_post_url' );

const postForm = ( { url, fields }, body ) => {
  const form = new FormData();
  Object.entries( fields ).forEach( ( [ name, value ] ) => form.append( name, value ) );
  form.append( 'file', new Blob( [ body ] ) );
  return fetch( url, { method: 'POST', body: form } );
};

describe( 'S3 getSignedPostUrl', () => {
  after( () => cleanup( key.prefix ) );

  it( 'Should return a URL and fields that upload an object with a form POST', async () => {
    const presigned = await s3.getSignedPostUrl( bucket, key( 'file.txt' ), 60 );

    const response = await postForm( presigned, 'posted content' );

    strictEqual( response.status, 204 );
    strictEqual( ( await readObject( key( 'file.txt' ) ) ).body, 'posted content' );
  } );

  it( 'Should enforce the native args conditions', async () => {
    const presigned = await s3.getSignedPostUrl( bucket, key( 'limited.txt' ), 60, {
      Conditions: [ [ 'content-length-range', 0, 10 ] ]
    } );

    const response = await postForm( presigned, 'x'.repeat( 50 ) );

    strictEqual( response.status, 400 );
    strictEqual( await objectExists( key( 'limited.txt' ) ), false );
  } );
} );
