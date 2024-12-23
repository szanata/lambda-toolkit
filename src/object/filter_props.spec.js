const filterProps = require( './filter_props' );

describe( 'Object: Filter Props Spec', () => {
  it( 'Should return false for a Date', () => {
    const result = filterProps( {
      a: 1,
      b: 2,
      c: 3
    }, [ 'a', 'c', 'd' ] );
    expect( result ).toEqual( {
      a: 1,
      c: 3
    } );
  } );
} );
