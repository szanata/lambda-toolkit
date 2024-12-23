const capitalizeWords = require( './capitalize_words' );

describe( 'Capitalize Words Spec', () => {
  it( 'Should convert each word in the string to lower case and capitalize the first letter', () => {
    expect( capitalizeWords( 'with DASH' ) ).toEqual( 'With Dash' );
    expect( capitalizeWords( 'ALL UPPERCASE' ) ).toEqual( 'All Uppercase' );
    expect( capitalizeWords( 'weird ¢tuff' ) ).toEqual( 'Weird ¢tuff' );
    expect( capitalizeWords( 'emoji: \uD83D\uDE03' ) ).toEqual( 'Emoji: \uD83D\uDE03' );
    expect( capitalizeWords( 'ALL_CAPS' ) ).toEqual( 'All_caps' );
    expect( capitalizeWords( 'pascalCase' ) ).toEqual( 'Pascalcase' );
    expect( capitalizeWords( 'CamelCase' ) ).toEqual( 'Camelcase' );
    expect( capitalizeWords( 'snake_case' ) ).toEqual( 'Snake_case' );
    expect( capitalizeWords( 'kebab-case' ) ).toEqual( 'Kebab-case' );
  } );

  it( 'Should preserve delimiters', () => {
    expect( capitalizeWords( 'car\rcar\u2003car  car\u00A0car' ) ).toEqual( 'Car\rCar\u2003Car  Car\u00A0Car' );
  } );
} );
