const round = require( './round' );

const now = 1679830316091;

describe( 'Round Spec', () => {
  it( 'Should round an epoch to given integer', () => {
    expect( round( now, 1000 ) ).toBe( 1679830316000 );
    expect( round( now, 10000 ) ).toBe( 1679830310000 );
    expect( round( now, 50000 ) ).toBe( 1679830300000 );
  } );
} );
