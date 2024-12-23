const calcStdDevPopulation = require( './calc_std_dev_population' );

describe( 'Math: Calc Population Standard Deviation spec', () => {
  it( 'Should calculate the population standard deviation between a set of numbers', () => {
    const numbers = [ 5, 3, 2, 4 ];
    const result = calcStdDevPopulation( numbers );
    expect( result ).toBe( 1.118033988749895 );
  } );

  it( 'Should return NaN if the array is empty', () => {
    const result = calcStdDevPopulation( [] );
    expect( result ).toEqual( NaN );
  } );

  it( 'Should return 0 if the array have length 1', () => {
    const result = calcStdDevPopulation( [ 3 ] );
    expect( result ).toEqual( 0 );
  } );
} );
