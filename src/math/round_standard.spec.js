const roundStandard = require( './round_standard' );

describe( 'Math: Round Standard Spec', () => {
  it( 'Should round numbers using simple arithmetic method', () => {
    expect( roundStandard( 1.3150 ) ).toBe( 1.32 );
    expect( roundStandard( 1.3250 ) ).toBe( 1.33 );
    expect( roundStandard( 1.0000001 ) ).toBe( 1 );
    expect( roundStandard( 1.009 ) ).toBe( 1.01 );
    expect( roundStandard( 1.5666 ) ).toBe( 1.57 );
    expect( roundStandard( 1.4444 ) ).toBe( 1.44 );
    expect( roundStandard( 1 ) ).toBe( 1 );
  } );

  it( 'Should round negative number', () => {
    expect( roundStandard( -1.3150 ) ).toBe( -1.31 );
    expect( roundStandard( -1.3250 ) ).toBe( -1.32 );
    expect( roundStandard( -1.0000001 ) ).toBe( -1 );
    expect( roundStandard( -1.009 ) ).toBe( -1.01 );
    expect( roundStandard( -1.5666 ) ).toBe( -1.57 );
    expect( roundStandard( -1.4444 ) ).toBe( -1.44 );
    expect( roundStandard( -1 ) ).toBe( -1 );
  } );

  it( 'Should work with exponential numbers', () => {
    expect( roundStandard( -4.625929269271485e-18 ) ).toBe( -0 );
    expect( roundStandard( 1.3250e2 ) ).toBe( 132.5 );
  } );

  it( 'Should round to different precisions', () => {
    expect( roundStandard( 3.333333, 0 ) ).toBe( 3. );
    expect( roundStandard( 3.333333, 1 ) ).toBe( 3.3 );
    expect( roundStandard( 3.333333, 2 ) ).toBe( 3.33 );
    expect( roundStandard( 3.333333, 3 ) ).toBe( 3.333 );
    expect( roundStandard( 3.333333, 4 ) ).toBe( 3.3333 );
  } );
} );
