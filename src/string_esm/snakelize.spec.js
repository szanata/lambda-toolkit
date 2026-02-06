import { snakelize } from './snakelize.js';
import { describe, it } from 'node:test';
import { strictEqual } from 'node:assert';

describe( 'Snakelize Spec', () => {
  it( 'Should convert camelCase', () => {
    strictEqual( snakelize( 'camelCase' ), 'camel_case' );
  } );

  it( 'Should convert PascalCase', () => {
    strictEqual( snakelize( 'PascalCase' ), 'pascal_case' );
  } );

  it( 'Should convert kebab-case', () => {
    strictEqual( snakelize( 'kebab-case' ), 'kebab_case' );
  } );

  it( 'Should interpret the last word of a sequence of uppercase as the first letter of the next sequence', () => {
    strictEqual( snakelize( 'ALL_CAPSAndPascalCase' ), 'all_caps_and_pascal_case' );
  } );

  it( 'Should convert mixed camelCase and PascalCase and kebab-case', () => {
    strictEqual( snakelize( 'fromCamelCase_AndPascalCase-and-kebab-case' ), 'from_camel_case_and_pascal_case_and_kebab_case' );
  } );

  it( 'Should handle spaces as delimiters', () => {
    strictEqual( snakelize( 'fromCamelCase AndPascalCase and-kebab-case' ), 'from_camel_case and_pascal_case and_kebab_case' );
  } );

  it( 'Should keep any time of delimiters that match "\\s" in place', () => {
    strictEqual( snakelize( 'aB\raB\u2003aB  aB\u00A0aB' ), 'a_b\ra_b\u2003a_b  a_b\u00A0a_b' );
  } );

  describe( 'Keep All Caps option', () => {
    it( 'Should work normally', () => {
      strictEqual( snakelize( 'camelCase', { keepAllCaps: true } ), 'camel_case' );
    } );

    it( 'Should keep ALL_CAPS', () => {
      strictEqual( snakelize( 'ALL_CAPS', { keepAllCaps: true } ), 'ALL_CAPS' );
    } );

    it( 'Should keep ALL_CAPS if it is limited by spaces', () => {
      strictEqual( snakelize( 'camelCase ALL_CAPS camelCase', { keepAllCaps: true } ), 'camel_case ALL_CAPS camel_case' );
    } );
  } );
} );
