const msToS = require( './ms_to_s' );

describe( 'MS to S Spec', () => {
  it( 'Should return ms converted to s', () => {
    expect( msToS( 49094 ) ).toBe( 50 );
  } );
} );
