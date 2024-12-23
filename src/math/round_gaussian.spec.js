const roundGaussian = require( './round_gaussian' );

describe( 'Math: Round Gaussian Spec', () => {
  it( 'Should round numbers using Gaussian/Bankers method', () => {
    expect( roundGaussian( 1.3150 ) ).toBe( 1.32 );
    expect( roundGaussian( 1.3250 ) ).toBe( 1.32 );
    expect( roundGaussian( 1.0000001 ) ).toBe( 1 );
    expect( roundGaussian( 1.009 ) ).toBe( 1.01 );
    expect( roundGaussian( 1.5666 ) ).toBe( 1.57 );
    expect( roundGaussian( 1.4444 ) ).toBe( 1.44 );
    expect( roundGaussian( 1 ) ).toBe( 1 );
  } );

  it( 'Should return NaN if number is invalid', () => {
    expect( roundGaussian( null ) ).toBe( NaN );
    expect( roundGaussian( NaN ) ).toBe( NaN );
    expect( roundGaussian( undefined ) ).toBe( NaN );
    expect( roundGaussian( '0' ) ).toBe( NaN );
  } );

  it( 'Should work with exponential numbers', () => {
    expect( roundGaussian( -4.625929269271485e-18 ) ).toBe( -0 );
    expect( roundGaussian( 1.3250e2 ) ).toBe( 132.5 );
  } );
} );
