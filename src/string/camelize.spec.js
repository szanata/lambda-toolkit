const camelize = require( './camelize' );

describe( 'Camelize Spec', () => {
  it( 'Should convert snake_case', () => {
    expect( camelize( 'snake_case' ) ).toEqual( 'snakeCase' );
  } );

  it( 'Should convert PascalCase', () => {
    expect( camelize( 'PascalCase' ) ).toEqual( 'pascalCase' );
  } );

  it( 'Should convert kebab-case', () => {
    expect( camelize( 'kebab-case' ) ).toEqual( 'kebabCase' );
  } );

  it( 'Should convert KEBAB-CASE (upper case)', () => {
    expect( camelize( 'KEBAB-CASE' ) ).toEqual( 'kebabCase' );
  } );

  it( 'Should convert ALL_CAPS', () => {
    expect( camelize( 'ALL_CAPS' ) ).toEqual( 'allCaps' );
  } );

  it( 'Should interpret the last word of a sequence of uppercase as the first letter of the next sequence', () => {
    expect( camelize( 'BDay' ) ).toEqual( 'bDay' );
    expect( camelize( 'ABBlood' ) ).toEqual( 'abBlood' );
    expect( camelize( 'ALL_CAPSAndPascalCase' ) ).toEqual( 'allCapsAndPascalCase' );
  } );

  it( 'Should convert mixed snake_case and PascalCase and kebab-case', () => {
    expect( camelize( 'from_snake_case_AndPascalCase-and-kebab-case' ) ).toEqual( 'fromSnakeCaseAndPascalCaseAndKebabCase' );
  } );

  it( 'Should handle spaces as delimiters', () => {
    expect( camelize( 'from_snake_case AndPascalCase and-kebab-case' ) ).toEqual( 'fromSnakeCase andPascalCase andKebabCase' );
  } );

  it( 'Should keep any time of delimiters that match "\\s" in place', () => {
    expect( camelize( 'a_b\ra_b\u2003a_b  a_b\u00A0a_b' ) ).toEqual( 'aB\raB\u2003aB  aB\u00A0aB' );
  } );

  describe( 'Keep All Caps option', () => {
    it( 'Should work normally', () => {
      expect( camelize( 'snake_case', { keepAllCaps: true } ) ).toEqual( 'snakeCase' );
    } );

    it( 'Should keep ALL_CAPS', () => {
      expect( camelize( 'ALL_CAPS', { keepAllCaps: true } ) ).toEqual( 'ALL_CAPS' );
    } );

    it( 'Should keep ALL_CAPS if it is limited by spaces', () => {
      expect( camelize( 'snake_case ALL_CAPS snake_case', { keepAllCaps: true } ) ).toEqual( 'snakeCase ALL_CAPS snakeCase' );
    } );
  } );
} );
