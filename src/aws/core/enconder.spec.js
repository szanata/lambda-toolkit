const { encode, decode } = require( './encoder' );

describe( 'Encoder Spec', () => {
  describe( 'Decode', () => {
    it( 'Should decode base64', () => {
      const result = decode( 'eyJmb28iOiJiYXIifQ==' );
      expect( result ).toEqual( { foo: 'bar' } );
    } );

    it( 'Should decode empty string', () => {
      const result = decode( '' );
      expect( result ).toBe( '' );
    } );

    it( 'Should not decode null', () => {
      const result = decode( null );
      expect( result ).toBe( null );
    } );

    it( 'Should not decode undefined', () => {
      const result = decode( undefined );
      expect( result ).toBe( undefined );
    } );
  } );

  describe( 'Encode', () => {
    it( 'Should encode base64', () => {
      const result = encode( { foo: 'bar' } );
      expect( result ).toEqual( 'eyJmb28iOiJiYXIifQ==' );
    } );

    it( 'Should encode empty string', () => {
      const result = encode( '' );
      expect( result ).toBe( 'IiI=' );
    } );

    it( 'Should not encode null', () => {
      const result = encode( null );
      expect( result ).toBe( null );
    } );

    it( 'Should not encode undefined', () => {
      const result = encode( undefined );
      expect( result ).toBe( undefined );
    } );
  } );
} );
