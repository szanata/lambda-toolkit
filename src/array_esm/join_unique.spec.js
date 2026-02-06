import { joinUnique } from './join_unique.js';
import { describe, it } from 'node:test';
import { deepStrictEqual } from 'node:assert';

describe( 'Array: Join Unique Spec', () => {
  it( 'Should join all array args to an array with unique values', () => {
    const result = joinUnique( undefined, null, [ 1, 2, 3 ], 'string', [ 3, 4, 5, 6 ], [ 1, 6 ] );
    deepStrictEqual( result, [ 1, 2, 3, 4, 5, 6 ] );
  } );

  it( 'Should not break on empty arrays', () => {
    const result = joinUnique();
    deepStrictEqual( result, [] );
  } );
} );
