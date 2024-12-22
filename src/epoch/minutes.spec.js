const minutes = require( './minutes' );

describe( 'Minutes Spec', () => {
  it( 'Should return x minutes in ms', () => {
    expect( minutes( 3 ) ).toBe( 180000 );
  } );
} );
