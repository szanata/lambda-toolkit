const calcMedianAbsDev = require( './calc_median_abs_dev' );

describe( 'Math: Calc Median Absolute Deviation Spec', () => {
  it( 'Should calculate the mad between a set of numbers', () => {
    const numbers = [ 15, 13, 11, 4, 19, 4 ];
    const result = calcMedianAbsDev( numbers );
    expect( result ).toBe( 5 );
  } );

  it( 'Should return NaN if the array is empty', () => {
    const result = calcMedianAbsDev( [] );
    expect( result ).toEqual( NaN );
  } );

  it( 'Should return 0 if the array have length 1', () => {
    const result = calcMedianAbsDev( [ 3 ] );
    expect( result ).toEqual( 0 );
  } );
} );
