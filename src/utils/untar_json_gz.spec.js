const { readFileSync } = require( 'fs' );
const { join } = require( 'path' );
const untarJsonGz = require( './untar_json_gz' );

const expectedFiles = [];
expectedFiles.push( require( './untar_gz_fixtures/file01.json' ) );
expectedFiles.push( require( './untar_gz_fixtures/file02.json' ) );
expectedFiles.push( require( './untar_gz_fixtures/file03.json' ) );
expectedFiles.push( require( './untar_gz_fixtures/file04.json' ) );
expectedFiles.push( require( './untar_gz_fixtures/file05.json' ) );

const compressed = readFileSync( join( __dirname, 'untar_gz_fixtures', 'files.tar.gz' ) );

describe( 'Utils: Untart Json Gzip Spec', () => {

  it( 'Should untar a gzip tarball containing only json files and return an array with each file content, parsed', async () => {
    const files = await untarJsonGz( compressed );

    expect( files.length ).toBe( expectedFiles.length );
    files.forEach( ( content, i ) =>
      expect( content ).toEqual( expectedFiles[i] )
    );
  } );
} );
