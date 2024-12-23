const isSerializable = require( './is_serializable' );

describe( 'Is Serializable', () => {
  it( 'Should return false for a Date', () => {
    const result = isSerializable( new Date() );
    expect( result ).toBe( false );
  } );

  it( 'Should return false for a Boolean', () => {
    const result = isSerializable( new Boolean() );
    expect( result ).toBe( false );
  } );

  it( 'Should return false for a Function', () => {
    const result = isSerializable( () => {} );
    expect( result ).toBe( false );
  } );

  it( 'Should return false for a String', () => {
    const result = isSerializable( new String( 'foo' ) );
    expect( result ).toBe( false );
  } );

  it( 'Should return false for a Number', () => {
    const result = isSerializable( new Number() );
    expect( result ).toBe( false );
  } );

  it( 'Should return false for a Date', () => {
    const result = isSerializable( new Date() );
    expect( result ).toBe( false );
  } );

  it( 'Should return false for a string', () => {
    const result = isSerializable( 'foo' );
    expect( result ).toBe( false );
  } );

  it( 'Should return false for a number', () => {
    const result = isSerializable( 1 );
    expect( result ).toBe( false );
  } );

  it( 'Should return false for a boolean', () => {
    const result = isSerializable( false );
    expect( result ).toBe( false );
  } );

  it( 'Should return false for a undefined', () => {
    const result = isSerializable( undefined );
    expect( result ).toBe( false );
  } );

  it( 'Should return false for a null', () => {
    const result = isSerializable( null );
    expect( result ).toBe( false );
  } );

  it( 'Should return true for a literal object */', () => {
    const result = isSerializable( { foo: 'bar' } );
    expect( result ).toBe( true );
  } );
} );
