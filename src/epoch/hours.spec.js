const hours = require( './hours' );

describe( 'Hours Spec', () => {
  it( 'Should return x hours in ms', () => {
    expect( hours( 3 ) ).toBe( 1.08e+7 );
  } );
} );
