const calcMedian = require( './calc_median' );

describe( 'Math: Calc Median Spec', () => {
  it( 'Should calculate the median between a odd set of numbers', () => {
    const numbers = [ 8, 2, 4, 9, 8, 0, 5 ];
    const result = calcMedian( numbers );
    expect( result ).toBe( 5 );
  } );

  it( 'Should calculate the median between a even set of numbers', () => {
    const result = calcMedian( [ 8, 2, 4, 9, 8, 0, 5, 1 ] );
    expect( result ).toEqual( 4.5 );
  } );

  it( 'Should return NaN if the array is empty', () => {
    const result = calcMedian( [] );
    expect( result ).toEqual( NaN );
  } );

  it( 'Should return the correct median', () => {
    const result = calcMedian( [ 8, 7, 17, 6, 11, 2 ] );
    expect( result ).toEqual( 7.5 );
  } );
} );
