const months = require( './months' );

describe( 'Months Spec', () => {
  it( 'Should return x months in ms', () => {
    expect( months( 3 ) ).toBe( 7.776e+9 );
  } );
} );
