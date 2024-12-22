const splitBatches = require( './split_batches' );

describe( 'Array: Split Batches spec', () => {
  it( 'Should split an array into batches of arrays with fixed length', () => {
    const array = [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ];
    const result = splitBatches( array, 2 );
    expect( result ).toEqual( [ [ 1, 2 ], [ 3, 4 ], [ 5, 6 ], [ 7, 8 ], [ 9 ] ] );
  } );
} );
