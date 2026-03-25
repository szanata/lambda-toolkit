import { months } from './months.js';
import { describe, it } from 'node:test';
import { strictEqual } from 'node:assert';

describe( 'Months Spec', () => {
  it( 'Should return x months in ms', () => {
    strictEqual( months( 3 ), 7.776e+9 );
  } );
} );
