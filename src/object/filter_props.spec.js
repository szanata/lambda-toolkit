import { filterProps } from './filter_props.js';
import { describe, it } from 'node:test';
import { deepStrictEqual } from 'node:assert';

describe( 'Object: Filter Props Spec', () => {
  it( 'Should return false for a Date', () => {
    const result = filterProps( {
      a: 1,
      b: 2,
      c: 3
    }, [ 'a', 'c', 'd' ] );
    deepStrictEqual( result, { a: 1, c: 3 } );
  } );
} );
