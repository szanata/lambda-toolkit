import { describe, it, after } from 'node:test';
import { strictEqual, deepStrictEqual } from 'node:assert';
import { bucket, s3, createKeyspace, putObject, readObject, cleanup } from './setup.js';

const key = createKeyspace( 'copy' );

describe( 'S3 copy', () => {
  after( () => cleanup( key.prefix ) );

  it( 'Should copy an object to another key, keeping its metadata', async () => {
    await putObject( key( 'source.txt' ), 'content', { ContentType: 'text/plain', Metadata: { owner: 'lambda-toolkit' } } );

    await s3.copy( bucket, key( 'target.txt' ), `${bucket}/${key( 'source.txt' )}` );

    const target = await readObject( key( 'target.txt' ) );
    strictEqual( target.body, 'content' );
    strictEqual( target.contentType, 'text/plain' );
    deepStrictEqual( target.metadata, { owner: 'lambda-toolkit' } );
  } );

  it( 'Should copy a source key with spaces and non ASCII characters', async () => {
    const source = key( 'report jan ção.txt' );
    await putObject( source, 'special' );

    await s3.copy( bucket, key( 'special-target.txt' ), `${bucket}/${source}` );

    strictEqual( ( await readObject( key( 'special-target.txt' ) ) ).body, 'special' );
  } );

  it( 'Should pass the native args to the request', async () => {
    await putObject( key( 'meta-source.txt' ), 'content', { Metadata: { owner: 'original' } } );

    await s3.copy( bucket, key( 'meta-target.txt' ), `${bucket}/${key( 'meta-source.txt' )}`, {
      MetadataDirective: 'REPLACE',
      Metadata: { owner: 'replaced' }
    } );

    deepStrictEqual( ( await readObject( key( 'meta-target.txt' ) ) ).metadata, { owner: 'replaced' } );
  } );
} );
