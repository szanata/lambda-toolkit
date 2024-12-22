const days = require( './days' );

describe( 'Days Spec', () => {
  it( 'Should return x days in ms', () => {
    expect( days( 3 ) ).toBe( 2.592e+8 );
  } );
} );
