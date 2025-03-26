const parseItem = require( './parse_item' );
const parseValue = require( './parse_value' );

jest.mock( './parse_value', () => jest.fn() );

describe( 'Parse Item Spec', () => {
  parseValue.mockImplementation( x => 'parsed_value:' + x );

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
    expect( result ).toEqual( {
      foo: 'parsed_value:1',
      bar: 'parsed_value:2'
    } );
  } );
} );
