const calcMean = require( './calc_mean' );

describe( 'Math: Calc Mean Spec', () => {
  it( 'Should calculate the mean between a set of numbers', () => {
    const numbers = [ 1, 2, 0, 5 ];
    const result = calcMean( numbers );
    expect( result ).toBe( 2 );
  } );

  it( 'Should return NaN if the array is empty', () => {
    const result = calcMean( [] );
    expect( result ).toEqual( NaN );
  } );
} );
