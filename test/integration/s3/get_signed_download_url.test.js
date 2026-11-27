import { describe, it, after } from 'node:test';
import { strictEqual } from 'node:assert';
import { setTimeout } from 'node:timers/promises';
import { bucket, s3, createKeyspace, putObject, cleanup } from './setup.js';

const key = createKeyspace( 'get_signed_download_url' );

describe( 'S3 getSignedDownloadUrl', () => {
  after( () => cleanup( key.prefix ) );

  it( 'Should return a URL that downloads the object', async () => {
    await putObject( key( 'file.txt' ), 'signed content' );

    const url = await s3.getSignedDownloadUrl( bucket, key( 'file.txt' ), 60 );
    const response = await fetch( url );

    strictEqual( response.status, 200 );
    strictEqual( await response.text(), 'signed content' );
  } );

  it( 'Should sign the native args into the URL', async () => {
    await putObject( key( 'disposition.txt' ), 'content' );

    const url = await s3.getSignedDownloadUrl( bucket, key( 'disposition.txt' ), 60, {
      ResponseContentDisposition: 'attachment; filename="report.txt"'
    } );
    const response = await fetch( url );

    strictEqual( response.headers.get( 'content-disposition' ), 'attachment; filename="report.txt"' );
  } );

  it( 'Should return a URL that is rejected after the expiration', async () => {
    await putObject( key( 'expiring.txt' ), 'content' );

    const url = await s3.getSignedDownloadUrl( bucket, key( 'expiring.txt' ), 1 );
    await setTimeout( 2500 );

    strictEqual( ( await fetch( url ) ).status, 403 );
  } );
} );
