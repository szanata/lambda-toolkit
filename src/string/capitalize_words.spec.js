import { capitalizeWords } from './capitalize_words.js';
import { describe, it } from 'node:test';
import { strictEqual } from 'node:assert';

describe( 'Capitalize Words Spec', () => {
  it( 'Should convert each word in the string to lower case and capitalize the first letter', () => {
    strictEqual( capitalizeWords( 'with DASH' ), 'With Dash' );
    strictEqual( capitalizeWords( 'ALL UPPERCASE' ), 'All Uppercase' );
    strictEqual( capitalizeWords( 'weird ¢tuff' ), 'Weird ¢tuff' );
    strictEqual( capitalizeWords( 'emoji: \uD83D\uDE03' ), 'Emoji: \uD83D\uDE03' );
    strictEqual( capitalizeWords( 'ALL_CAPS' ), 'All_caps' );
    strictEqual( capitalizeWords( 'pascalCase' ), 'Pascalcase' );
    strictEqual( capitalizeWords( 'CamelCase' ), 'Camelcase' );
    strictEqual( capitalizeWords( 'snake_case' ), 'Snake_case' );
    strictEqual( capitalizeWords( 'kebab-case' ), 'Kebab-case' );
  } );

  it( 'Should preserve delimiters', () => {
    strictEqual( capitalizeWords( 'car\rcar\u2003car  car\u00A0car' ), 'Car\rCar\u2003Car  Car\u00A0Car' );
  } );
} );
