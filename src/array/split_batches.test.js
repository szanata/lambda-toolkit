import { splitBatches } from './split_batches.js';
import { describe, it } from 'node:test';
import { deepStrictEqual } from 'node:assert';

describe( 'Array: Split Batches spec', () => {
  it( 'Should split an array into batches of arrays with fixed length', () => {
    const array = [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ];
    const result = splitBatches( array, 2 );
    deepStrictEqual( result, [ [ 1, 2 ], [ 3, 4 ], [ 5, 6 ], [ 7, 8 ], [ 9 ] ] );
  } );
} );
