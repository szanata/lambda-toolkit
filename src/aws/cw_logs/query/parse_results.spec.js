const parseResults = require( './parse_results' );
const parseItem = require( './parse_item' );

jest.mock( './parse_item', () => jest.fn() );

describe( 'Parse Results Spec', () => {
  it( 'Should call the parseItem function for each value in the array', () => {
    parseItem.mockImplementation( v => 'parsed:' + v );
    const result = parseResults( [ 1, 2, 3 ] );

    expect( result ).toEqual( [
      'parsed:1',
      'parsed:2',
      'parsed:3'
    ] );
  } );
} );
