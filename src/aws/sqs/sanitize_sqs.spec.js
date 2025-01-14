const sanitizeSqs = require( './sanitize_sqs' );

describe( 'Sanitize SQS', () => {
  it( 'Should replace invalid SQS characters from strings', () => {
    const result = sanitizeSqs( String.fromCharCode( 0x00 ) + 'foo' );
    expect( result ).toBe( 'foo' );
  } );
} );
