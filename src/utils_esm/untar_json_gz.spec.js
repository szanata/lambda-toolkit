import { untarJsonGz } from './untar_json_gz.js';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it } from 'node:test';
import { strictEqual, deepStrictEqual } from 'node:assert';

import file1 from './untar_gz_fixtures/file01.json' with { type: 'json' };
import file2 from './untar_gz_fixtures/file02.json' with { type: 'json' };
import file3 from './untar_gz_fixtures/file03.json' with { type: 'json' };
import file4 from './untar_gz_fixtures/file04.json' with { type: 'json' };
import file5 from './untar_gz_fixtures/file05.json' with { type: 'json' };

const __filename = fileURLToPath( import.meta.url );
const __dirname = dirname( __filename );

const expectedFiles = [
  file1,
  file2,
  file3,
  file4,
  file5
];

const compressed = readFileSync( join( __dirname, 'untar_gz_fixtures', 'files.tar.gz' ) );

describe( 'Utils: Untart Json Gzip Spec', () => {
  it( 'Should untar a gzip tarball containing only json files and return an array with each file content, parsed', async () => {
    const files = await untarJsonGz( compressed );

    strictEqual( files.length, expectedFiles.length );
    files.forEach( ( content, i ) =>
      deepStrictEqual( content, expectedFiles[i] )
    );
  } );
} );
