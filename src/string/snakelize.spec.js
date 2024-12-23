const snakelize = require( './snakelize' );

describe( 'Snakelize Spec', () => {
  it( 'Should convert camelCase', () => {
    expect( snakelize( 'camelCase' ) ).toEqual( 'camel_case' );
  } );

  it( 'Should convert PascalCase', () => {
    expect( snakelize( 'PascalCase' ) ).toEqual( 'pascal_case' );
  } );

  it( 'Should convert kebab-case', () => {
    expect( snakelize( 'kebab-case' ) ).toEqual( 'kebab_case' );
  } );

  it( 'Should not convert ALL_CAPS', () => {
    expect( snakelize( 'CONSTANT_SYNTAX' ) ).toEqual( 'CONSTANT_SYNTAX' );
  } );

  it( 'Should interpret the last word of a sequence of uppercase as the first letter of the next sequence', () => {
    expect( snakelize( 'ALL_CAPSAndPascalCase' ) ).toEqual( 'all_caps_and_pascal_case' );
  } );

  it( 'Should convert mixed camelCase and PascalCase and kebab-case', () => {
    expect( snakelize( 'fromCamelCase_AndPascalCase-and-kebab-case' ) ).toEqual( 'from_camel_case_and_pascal_case_and_kebab_case' );
  } );

  it( 'Should handle spaces as delimiters', () => {
    expect( snakelize( 'fromCamelCase AndPascalCase and-kebab-case' ) ).toEqual( 'from_camel_case and_pascal_case and_kebab_case' );
  } );

  it( 'Should keep ALL_CAPS if it is limited by spaces', () => {
    expect( snakelize( 'camelCase ALL_CAPS camelCase' ) ).toEqual( 'camel_case ALL_CAPS camel_case' );
  } );

  it( 'Should keep any time of delimiters that match "\\s" in place', () => {
    expect( snakelize( 'aB\raB\u2003aB  aB\u00A0aB' ) ).toEqual( 'a_b\ra_b\u2003a_b  a_b\u00A0a_b' );
  } );
} );
