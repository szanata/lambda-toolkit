const seconds = require( './seconds' );

describe( 'Seconds Spec', () => {
  it( 'Should return x seconds in ms', () => {
    expect( seconds( 3 ) ).toBe( 3000 );
  } );
} );
