import { Encoder } from './encoder.js';
import { describe, it } from 'node:test';
import { strictEqual, deepStrictEqual } from 'node:assert';

describe( 'Encoder Spec', () => {
  describe( 'Decode', () => {
    it( 'Should decode base64', () => {
      const result = Encoder.decode( 'eyJmb28iOiJiYXIifQ==' );
      deepStrictEqual( result, { foo: 'bar' } );
    } );

    it( 'Should decode empty string', () => {
      const result = Encoder.decode( '' );
      strictEqual( result, '' );
    } );

    it( 'Should not decode null', () => {
      const result = Encoder.decode( null );
      strictEqual( result, null );
    } );

    it( 'Should not decode undefined', () => {
      const result = Encoder.decode( undefined );
      strictEqual( result, undefined );
    } );
  } );

  describe( 'Encode', () => {
    it( 'Should encode base64', () => {
      const result = Encoder.encode( { foo: 'bar' } );
      strictEqual( result, 'eyJmb28iOiJiYXIifQ==' );
    } );

    it( 'Should encode empty string', () => {
      const result = Encoder.encode( '' );
      strictEqual( result, 'IiI=' );
    } );

    it( 'Should not encode null', () => {
      const result = Encoder.encode( null );
      strictEqual( result, null );
    } );

    it( 'Should not encode undefined', () => {
      const result = Encoder.encode( undefined );
      strictEqual( result, undefined );
    } );
  } );
} );
