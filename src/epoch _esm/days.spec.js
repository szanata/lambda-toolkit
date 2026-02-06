import { days } from './days.js';
import { describe, it } from 'node:test';
import { strictEqual } from 'node:assert';

describe( 'Days Spec', () => {
  it( 'Should return x days in ms', () => {
    strictEqual( days( 3 ), 2.592e+8 );
  } );
} );
