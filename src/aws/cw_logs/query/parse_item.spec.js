import { describe, it, mock } from 'node:test';
import { deepStrictEqual } from 'node:assert';

const parseValueMock = mock.fn();

mock.module( './parse_value.js', {
  namedExports: {
    parseValue: parseValueMock
  }
} );

const { parseItem } = await import( './parse_item.js' );

describe( 'Parse Item Spec', () => {
  parseValueMock.mock.mockImplementation( x => 'parsed_value:' + x );

  it( 'Should reduce an item (array) to an object', () => {
    const item = [
      {
        field: 'foo',
        value: 1
      },
      {
        field: 'bar',
        value: 2
      }
    ];

    const result = parseItem( item );
    deepStrictEqual( result, {
      foo: 'parsed_value:1',
      bar: 'parsed_value:2'
    } );
  } );
} );
