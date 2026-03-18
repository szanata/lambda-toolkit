import { camelize } from './camelize.js';
import { describe, it } from 'node:test';
import { strictEqual } from 'node:assert';

describe( 'Camelize Spec', () => {
  it( 'Should convert snake_case', () => {
    strictEqual( camelize( 'snake_case' ), 'snakeCase' );
  } );

  it( 'Should convert PascalCase', () => {
    strictEqual( camelize( 'PascalCase' ), 'pascalCase' );
  } );

  it( 'Should convert kebab-case', () => {
    strictEqual( camelize( 'kebab-case' ), 'kebabCase' );
  } );

  it( 'Should convert KEBAB-CASE (upper case)', () => {
    strictEqual( camelize( 'KEBAB-CASE' ), 'kebabCase' );
  } );

  it( 'Should convert ALL_CAPS', () => {
    strictEqual( camelize( 'ALL_CAPS' ), 'allCaps' );
  } );

  it( 'Should interpret the last word of a sequence of uppercase as the first letter of the next sequence', () => {
    strictEqual( camelize( 'BDay' ), 'bDay' );
    strictEqual( camelize( 'ABBlood' ), 'abBlood' );
    strictEqual( camelize( 'ALL_CAPSAndPascalCase' ), 'allCapsAndPascalCase' );
  } );

  it( 'Should convert mixed snake_case and PascalCase and kebab-case', () => {
    strictEqual( camelize( 'from_snake_case_AndPascalCase-and-kebab-case' ), 'fromSnakeCaseAndPascalCaseAndKebabCase' );
  } );

  it( 'Should handle spaces as delimiters', () => {
    strictEqual( camelize( 'from_snake_case AndPascalCase and-kebab-case' ), 'fromSnakeCase andPascalCase andKebabCase' );
  } );

  it( 'Should keep any time of delimiters that match "\\s" in place', () => {
    strictEqual( camelize( 'a_b\ra_b\u2003a_b  a_b\u00A0a_b' ), 'aB\raB\u2003aB  aB\u00A0aB' );
  } );

  describe( 'Keep All Caps option', () => {
    it( 'Should work normally', () => {
      strictEqual( camelize( 'snake_case', { keepAllCaps: true } ), 'snakeCase' );
    } );

    it( 'Should keep ALL_CAPS', () => {
      strictEqual( camelize( 'ALL_CAPS', { keepAllCaps: true } ), 'ALL_CAPS' );
    } );

    it( 'Should keep ALL_CAPS if it is limited by spaces', () => {
      strictEqual( camelize( 'snake_case ALL_CAPS snake_case', { keepAllCaps: true } ), 'snakeCase ALL_CAPS snakeCase' );
    } );
  } );
} );
