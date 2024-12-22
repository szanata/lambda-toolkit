const joinUnique = require( './join_unique' );

describe( 'Array: Join Unique Spec', () => {
  it( 'Should join all array args to an array with unique values', () => {
    const result = joinUnique( undefined, null, [ 1, 2, 3 ], 'string', [ 3, 4, 5, 6 ], [ 1, 6 ] );
    expect( result ).toEqual( [ 1, 2, 3, 4, 5, 6 ] );
  } );

  it( 'Should not break on empty arrays', () => {
    const result = joinUnique();
    expect( result ).toEqual( [] );
  } );
} );
