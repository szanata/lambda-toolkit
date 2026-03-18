import { describe, it, mock } from 'node:test';
import { deepStrictEqual } from 'node:assert';

const parseItemMock = mock.fn();

mock.module( './parse_item.js', {
  namedExports: {
    parseItem: parseItemMock
  }
} );

const { parseResults } = await import( './parse_results.js' );

describe( 'Parse Results Spec', () => {
  it( 'Should call the parseItem function for each value in the array', () => {
    parseItemMock.mock.mockImplementation( v => 'parsed:' + v );
    const result = parseResults( [ 1, 2, 3 ] );

    deepStrictEqual( result, [
      'parsed:1',
      'parsed:2',
      'parsed:3'
    ] );
  } );
} );
