import { removeEmptyArrays } from './remove_empty_arrays.js';
import { describe, it } from 'node:test';
import { deepStrictEqual } from 'node:assert';

describe( 'Object: Remove Empty Arrays', () => {
  it( 'Should return false for a Date', () => {
    const result = removeEmptyArrays( {
      a: [],
      b: 2,
      c: [ 1, 2, 3 ],
      d: undefined,
      e: null,
      f: { g: [], h: [ 1 ] },
      i: { j: [] }
    } );
    deepStrictEqual( result, {
      b: 2,
      c: [ 1, 2, 3 ],
      d: undefined,
      e: null,
      f: { g: [], h: [ 1 ] },
      i: { j: [] }
    } );
  } );
} );
